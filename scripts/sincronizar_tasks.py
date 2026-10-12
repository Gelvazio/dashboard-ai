#!/usr/bin/env python3
"""
sincronizar_tasks.py — Sincroniza a fila de tasks do Supabase (`public.tasks`)
de UM projeto com arquivos Markdown locais em `tasks/fila/`.

O Dashboard AI é multi-projeto: cada projeto (tabela `public.projects`, pelo `slug`)
tem sua fila. Escolha o projeto com --projeto <slug> ou DASHBOARD_AI_PROJECT
(padrão: `default`). Códigos de task são únicos por projeto.

Comandos:
  consulta   Lista as tasks do banco (filtros por status/código; --json).
  exportar   Banco  -> tasks/fila/<CODIGO>.md
  importar   tasks/fila/*.md -> banco (upsert por `codigo`; arquivo sem código cria task nova)
  conferir   Compara arquivos locais x banco e aponta divergências (exit code 1 se houver)

Configuração (variáveis de ambiente ou arquivo .env na raiz do repositório):
  SUPABASE_URL               (ou VITE_SUPABASE_URL)
  SUPABASE_SERVICE_ROLE_KEY  (obrigatória: o RLS bloqueia a chave anon)
  DASHBOARD_AI_PROJECT       (opcional; slug do projeto, padrão `default`)

Formato do arquivo Markdown:
  ---
  codigo: TASK-0001
  projeto: default        # informativo; o importar recusa arquivo de outro projeto
  titulo: Criar tela de login
  tipo: ia                # ia (agente) | humano (aprovação/teste feito por pessoa)
  prioridade: 2
  ordem: 0
  dependencias: [TASK-0000]
  executar: true
  executar_apos:
  max_tentativas: 3
  status: pendente        # informativo (só é enviado no importar com --com-status)
  tentativas: 0           # informativo, somente leitura
  ---
  Instrução completa em Markdown para a IA...

  <!-- RESULTADO (somente leitura, gerado pelo exportar) -->
  ...relatório gravado pela IA...

Sem dependências externas: usa apenas a biblioteca padrão do Python 3.8+.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

RAIZ = Path(__file__).resolve().parent.parent
PASTA_FILA_PADRAO = RAIZ / "tasks" / "fila"
MARCADOR_RESULTADO = "<!-- RESULTADO (somente leitura, gerado pelo exportar) -->"

# Campos que o arquivo local controla (enviados no importar e comparados no conferir)
CAMPOS_EDITAVEIS = ["titulo", "instrucao", "tipo", "prioridade", "ordem", "dependencias",
                    "executar", "executar_apos", "max_tentativas"]
# Campos informativos escritos no cabeçalho pelo exportar
CAMPOS_INFO = ["status", "tentativas", "trava_frente", "trava_em", "pr_url", "commit_sha", "updated_at"]
ORDEM_CABECALHO = ["codigo", "projeto", "titulo", "tipo", "prioridade", "ordem", "dependencias", "executar",
                   "executar_apos", "max_tentativas"] + CAMPOS_INFO
STATUS_VALIDOS = {"pendente", "em_execucao", "concluida", "recusada", "erro", "cancelada"}
TIPOS_VALIDOS = {"ia", "humano"}
PROJETO_PADRAO = "default"


class ErroSync(Exception):
    pass


# --------------------------------------------------------------------------- #
# Configuração
# --------------------------------------------------------------------------- #
def carregar_env(caminho: Path) -> None:
    """Carrega KEY=VALUE de um .env sem sobrescrever variáveis já definidas."""
    if not caminho.is_file():
        return
    for linha in caminho.read_text(encoding="utf-8").splitlines():
        linha = linha.strip()
        if not linha or linha.startswith("#") or "=" not in linha:
            continue
        chave, valor = linha.split("=", 1)
        chave = chave.strip()
        if chave.startswith("export "):
            chave = chave[len("export "):].strip()
        valor = valor.strip().strip('"').strip("'")
        os.environ.setdefault(chave, valor)


def config_supabase() -> Tuple[str, str]:
    url = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
    chave = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not chave:
        raise ErroSync("Defina SUPABASE_URL (ou VITE_SUPABASE_URL) e SUPABASE_SERVICE_ROLE_KEY no ambiente "
                       "ou no arquivo .env (a chave anon não acessa a fila: RLS).")
    return url.rstrip("/"), chave


# --------------------------------------------------------------------------- #
# Cliente REST mínimo (PostgREST do Supabase)
# --------------------------------------------------------------------------- #
class ClienteSupabase:
    project_id: Optional[int] = None
    projeto: str = PROJETO_PADRAO

    def __init__(self, url: str, chave: str, base_rest: Optional[str] = None):
        # base_rest permite apontar direto para um PostgREST (testes locais)
        self.base = base_rest or os.environ.get("SUPABASE_REST_URL") or f"{url}/rest/v1"
        self.headers = {
            "apikey": chave,
            "Authorization": f"Bearer {chave}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    def _req(self, metodo: str, caminho: str, params: Optional[Dict[str, str]] = None,
             corpo: Any = None, prefer: Optional[str] = None) -> Any:
        url = f"{self.base}/{caminho}"
        if params:
            url += "?" + urllib.parse.urlencode(params, safe=",.*()")
        headers = dict(self.headers)
        if prefer:
            headers["Prefer"] = prefer
        dados = json.dumps(corpo).encode("utf-8") if corpo is not None else None
        req = urllib.request.Request(url, data=dados, method=metodo, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                texto = resp.read().decode("utf-8")
                return json.loads(texto) if texto else None
        except urllib.error.HTTPError as e:
            detalhe = e.read().decode("utf-8", "replace")
            raise ErroSync(f"HTTP {e.code} em {metodo} {caminho}: {detalhe}") from None
        except urllib.error.URLError as e:
            raise ErroSync(f"Falha de conexão com {self.base}: {e.reason}") from None

    def usar_projeto(self, slug: str) -> None:
        """Resolve o projeto pelo slug; todas as operações seguintes ficam restritas a ele."""
        slug = (slug or PROJETO_PADRAO).strip().lower()
        r = self._req("GET", "projects", {"select": "id,slug,excluido", "slug": f"eq.{slug}"}) or []
        if not r or r[0].get("excluido"):
            raise ErroSync(f"projeto {slug!r} não encontrado em public.projects")
        self.project_id, self.projeto = int(r[0]["id"]), slug

    def _escopo(self) -> Dict[str, str]:
        if self.project_id is None:
            raise ErroSync("projeto não definido (chame usar_projeto)")
        return {"project_id": f"eq.{self.project_id}"}

    def listar_tasks(self, status: Optional[List[str]] = None,
                     codigos: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        params = {"select": "*", "excluido": "eq.false", "order": "prioridade.asc,ordem.asc,created_at.asc",
                  **self._escopo()}
        if status:
            params["status"] = f"in.({','.join(status)})"
        if codigos:
            params["codigo"] = "in.(" + ",".join(f'"{c}"' for c in codigos) + ")"
        return self._req("GET", "tasks", params) or []

    def inserir_task(self, dados: Dict[str, Any]) -> Dict[str, Any]:
        self._escopo()
        corpo = dict(dados, project_id=self.project_id)
        corpo.setdefault("origem", "repositorio")
        r = self._req("POST", "tasks", corpo=corpo, prefer="return=representation")
        return r[0]

    def atualizar_task(self, codigo: str, dados: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        r = self._req("PATCH", "tasks", {"codigo": f"eq.{codigo}", **self._escopo()}, corpo=dados,
                      prefer="return=representation")
        return r[0] if r else None


# --------------------------------------------------------------------------- #
# Markdown <-> dict
# --------------------------------------------------------------------------- #
def _valor_para_texto(v: Any) -> str:
    if v is None:
        return ""
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, list):
        return "[" + ", ".join(str(x) for x in v) + "]"
    return str(v).replace("\n", " ")


def _texto_para_valor(campo: str, texto: str) -> Any:
    t = texto.strip()
    if campo == "dependencias":
        t = t.strip("[]")
        return [x.strip().strip("'\"") for x in t.split(",") if x.strip().strip("'\"")]
    if t == "" or t.lower() in ("null", "none", "~"):
        return None
    if campo in ("executar",):
        if t.lower() in ("true", "sim", "on", "1", "yes"):
            return True
        if t.lower() in ("false", "nao", "não", "off", "0", "no"):
            return False
        raise ErroSync(f"valor inválido para executar: {t!r}")
    if campo in ("prioridade", "ordem", "max_tentativas", "tentativas"):
        try:
            return int(t)
        except ValueError:
            raise ErroSync(f"valor inválido para {campo}: {t!r}") from None
    if len(t) >= 2 and t[0] == t[-1] and t[0] in "'\"":
        t = t[1:-1]
    return t


def task_para_markdown(task: Dict[str, Any], projeto: Optional[str] = None) -> str:
    task = dict(task)
    if projeto:
        task["projeto"] = projeto
    linhas = ["---"]
    for campo in ORDEM_CABECALHO:
        if campo in CAMPOS_INFO + ["projeto", "codigo"] and task.get(campo) in (None, ""):
            continue
        linhas.append(f"{campo}: {_valor_para_texto(task.get(campo))}".rstrip())
    linhas.append("---")
    corpo = (task.get("instrucao") or "").rstrip("\n")
    texto = "\n".join(linhas) + "\n" + corpo + "\n"
    if task.get("resultado"):
        texto += f"\n{MARCADOR_RESULTADO}\n{task['resultado'].rstrip()}\n"
    return texto


def markdown_para_task(texto: str, origem: str = "?") -> Dict[str, Any]:
    texto = texto.replace("\r\n", "\n").lstrip("\ufeff")
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", texto, re.S)
    if not m:
        raise ErroSync(f"{origem}: cabeçalho '---' ausente ou malformado")
    cabecalho, corpo = m.group(1), m.group(2)
    task: Dict[str, Any] = {}
    for n, linha in enumerate(cabecalho.split("\n"), start=2):
        if not linha.strip() or linha.lstrip().startswith("#"):
            continue
        if ":" not in linha:
            raise ErroSync(f"{origem}:{n}: linha de cabeçalho inválida: {linha!r}")
        campo, valor = linha.split(":", 1)
        campo = campo.strip()
        valor = re.sub(r"\s+#.*$", "", valor) if campo != "titulo" else valor
        try:
            task[campo] = _texto_para_valor(campo, valor)
        except ErroSync as e:
            raise ErroSync(f"{origem}:{n}: {e}") from None
    if MARCADOR_RESULTADO in corpo:
        corpo, resultado = corpo.split(MARCADOR_RESULTADO, 1)
        task["resultado"] = resultado.strip() or None
    task["instrucao"] = corpo.strip("\n")
    if not task.get("titulo"):
        raise ErroSync(f"{origem}: campo 'titulo' é obrigatório")
    if not task["instrucao"].strip():
        raise ErroSync(f"{origem}: a instrução (corpo do arquivo) está vazia")
    if task.get("prioridade") is not None and not 1 <= task["prioridade"] <= 5:
        raise ErroSync(f"{origem}: prioridade deve estar entre 1 e 5")
    if task.get("tipo") is not None and task["tipo"] not in TIPOS_VALIDOS:
        raise ErroSync(f"{origem}: tipo inválido {task['tipo']!r} (use ia ou humano)")
    if task.get("status") is not None and task["status"] not in STATUS_VALIDOS:
        raise ErroSync(f"{origem}: status inválido {task['status']!r}")
    return task


def ler_pasta(pasta: Path) -> List[Tuple[Path, Dict[str, Any]]]:
    if not pasta.is_dir():
        return []
    itens = []
    for arq in sorted(pasta.glob("*.md")):
        if arq.name.lower() == "readme.md":
            continue
        itens.append((arq, markdown_para_task(arq.read_text(encoding="utf-8"), str(arq))))
    return itens


def nome_arquivo(codigo: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]", "_", codigo) + ".md"


# --------------------------------------------------------------------------- #
# Comparação
# --------------------------------------------------------------------------- #
def _normalizar(campo: str, v: Any) -> Any:
    if campo == "dependencias":
        return list(v or [])
    if campo == "instrucao":
        return (v or "").strip()
    if campo == "executar_apos" and v:
        return str(v).replace("T", " ").replace("+00:00", "Z")
    return v


def diferencas(local: Dict[str, Any], remoto: Dict[str, Any]) -> List[str]:
    difs = []
    for campo in CAMPOS_EDITAVEIS:
        if campo not in local:
            continue
        a, b = _normalizar(campo, local.get(campo)), _normalizar(campo, remoto.get(campo))
        if a != b:
            if campo == "instrucao":
                difs.append("instrucao (conteúdo diferente)")
            else:
                difs.append(f"{campo}: local={a!r} banco={b!r}")
    return difs


# --------------------------------------------------------------------------- #
# Comandos
# --------------------------------------------------------------------------- #
def verificar_projeto(locais: List[Tuple[Path, Dict[str, Any]]], projeto: str) -> None:
    """Recusa arquivos marcados com outro projeto (evita misturar filas)."""
    for arq, t in locais:
        if t.get("projeto") and str(t["projeto"]).strip().lower() != projeto:
            raise ErroSync(f"{arq.name}: arquivo do projeto {t['projeto']!r}, mas a sincronização é do "
                           f"projeto {projeto!r} (use --projeto ou outra --pasta)")


def cmd_consulta(cli: ClienteSupabase, args) -> int:
    tasks = cli.listar_tasks(args.status, args.codigo)
    if args.json:
        print(json.dumps(tasks, ensure_ascii=False, indent=2, default=str))
        return 0
    if not tasks:
        print("Nenhuma task encontrada.")
        return 0
    print(f"Projeto: {cli.projeto}")
    print(f"{'CÓDIGO':<12} {'P':>1} {'ORD':>4} {'ON':<3} {'STATUS':<12} {'TENT':<5} TÍTULO")
    for t in tasks:
        on = "on" if t.get("executar") else "off"
        tent = f"{t.get('tentativas', 0)}/{t.get('max_tentativas', '?')}"
        if t.get("tipo") == "humano":
            tent = "humano"
        trava = f"  [trava: {t['trava_frente']}]" if t.get("trava_frente") else ""
        print(f"{t['codigo']:<12} {t['prioridade']:>1} {t['ordem']:>4} {on:<3} {t['status']:<12} {tent:<5} "
              f"{t['titulo']}{trava}")
    contagem: Dict[str, int] = {}
    for t in tasks:
        contagem[t["status"]] = contagem.get(t["status"], 0) + 1
    print("\nTotal: %d | %s" % (len(tasks), ", ".join(f"{k}: {v}" for k, v in sorted(contagem.items()))))
    return 0


def cmd_exportar(cli: ClienteSupabase, args) -> int:
    pasta = Path(args.pasta)
    tasks = cli.listar_tasks(args.status, args.codigo)
    if not args.dry_run:
        pasta.mkdir(parents=True, exist_ok=True)
    novos = alterados = iguais = 0
    for t in tasks:
        destino = pasta / nome_arquivo(t["codigo"])
        conteudo = task_para_markdown(t, cli.projeto)
        atual = destino.read_text(encoding="utf-8") if destino.exists() else None
        if atual == conteudo:
            iguais += 1
            continue
        acao = "criado" if atual is None else "atualizado"
        novos += atual is None
        alterados += atual is not None
        print(f"{'[dry-run] ' if args.dry_run else ''}{acao}: {os.path.relpath(destino)}")
        if not args.dry_run:
            destino.write_text(conteudo, encoding="utf-8")
    print(f"Exportação: {len(tasks)} task(s) | {novos} novo(s), {alterados} atualizado(s), {iguais} sem mudança.")
    return 0


def cmd_importar(cli: ClienteSupabase, args) -> int:
    pasta = Path(args.pasta)
    locais = ler_pasta(pasta)
    if args.codigo:
        locais = [(a, t) for a, t in locais if t.get("codigo") in args.codigo]
    if not locais:
        print(f"Nenhum arquivo .md encontrado em {pasta}.")
        return 0
    verificar_projeto(locais, cli.projeto)
    codigos = [t["codigo"] for _, t in locais if t.get("codigo")]
    remotos = {t["codigo"]: t for t in cli.listar_tasks(codigos=codigos)} if codigos else {}
    criadas = atualizadas = iguais = 0
    campos = CAMPOS_EDITAVEIS + (["status"] if args.com_status else [])
    for arq, local in locais:
        dados = {c: local[c] for c in campos if c in local}
        codigo = local.get("codigo")
        prefixo = "[dry-run] " if args.dry_run else ""
        if codigo and codigo in remotos:
            difs = diferencas(local, remotos[codigo])
            if args.com_status and local.get("status") and local["status"] != remotos[codigo]["status"]:
                difs.append(f"status: local={local['status']!r} banco={remotos[codigo]['status']!r}")
            if not difs:
                iguais += 1
                continue
            print(f"{prefixo}atualizar {codigo}: " + "; ".join(difs))
            if not args.dry_run:
                cli.atualizar_task(codigo, dados)
            atualizadas += 1
        else:
            if codigo:
                dados["codigo"] = codigo
            print(f"{prefixo}criar {codigo or '(código automático)'} a partir de {arq.name}")
            if not args.dry_run:
                nova = cli.inserir_task(dados)
                if not codigo:
                    # grava o código gerado pelo banco no arquivo e renomeia para <CODIGO>.md
                    destino = arq.with_name(nome_arquivo(nova["codigo"]))
                    destino.write_text(task_para_markdown(nova, cli.projeto), encoding="utf-8")
                    if destino != arq:
                        arq.unlink()
                    print(f"  -> código gerado: {nova['codigo']} ({destino.name})")
            criadas += 1
    print(f"Importação: {len(locais)} arquivo(s) | {criadas} criada(s), {atualizadas} atualizada(s), "
          f"{iguais} sem mudança.")
    return 0


def cmd_conferir(cli: ClienteSupabase, args) -> int:
    pasta = Path(args.pasta)
    locais = ler_pasta(pasta)
    verificar_projeto(locais, cli.projeto)
    remotos = {t["codigo"]: t for t in cli.listar_tasks()}
    vistos = set()
    problemas = 0
    for arq, local in locais:
        codigo = local.get("codigo")
        if not codigo:
            print(f"SÓ LOCAL   {arq.name}: sem código (será criada no importar)")
            problemas += 1
            continue
        vistos.add(codigo)
        if codigo not in remotos:
            print(f"SÓ LOCAL   {codigo} ({arq.name}): não existe no banco")
            problemas += 1
            continue
        difs = diferencas(local, remotos[codigo])
        if difs:
            print(f"DIVERGE    {codigo}: " + "; ".join(difs))
            problemas += 1
        elif args.verbose:
            print(f"OK         {codigo}")
    for codigo, t in remotos.items():
        if codigo not in vistos:
            print(f"SÓ BANCO   {codigo}: {t['titulo']} [{t['status']}]")
            problemas += 1
    if problemas:
        print(f"\n{problemas} divergência(s) entre {pasta} e o banco.")
        return 1
    print(f"Tudo sincronizado: {len(locais)} arquivo(s) local(is) = {len(remotos)} task(s) no banco.")
    return 0


def montar_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="sincronizar_tasks.py",
        description="Sincroniza a fila de tasks do Supabase com arquivos Markdown em tasks/fila/.")
    p.add_argument("--pasta", default=str(PASTA_FILA_PADRAO), help="pasta dos arquivos .md (padrão: tasks/fila)")
    p.add_argument("--env", default=str(RAIZ / ".env"), help="arquivo .env a carregar (padrão: .env na raiz)")
    p.add_argument("--projeto", help="slug do projeto (padrão: $DASHBOARD_AI_PROJECT ou 'default')")
    sub = p.add_subparsers(dest="comando", required=True)

    def filtros(sp, status=True):
        if status:
            sp.add_argument("--status", action="append", choices=sorted(STATUS_VALIDOS),
                            help="filtrar por status (pode repetir)")
        sp.add_argument("--codigo", action="append", help="filtrar por código (pode repetir)")

    sp = sub.add_parser("consulta", help="lista as tasks do banco")
    filtros(sp)
    sp.add_argument("--json", action="store_true", help="saída em JSON")

    sp = sub.add_parser("exportar", help="banco -> arquivos .md")
    filtros(sp)
    sp.add_argument("--dry-run", action="store_true", help="só mostra o que seria feito")

    sp = sub.add_parser("importar", help="arquivos .md -> banco (upsert por código)")
    filtros(sp, status=False)
    sp.add_argument("--dry-run", action="store_true", help="só mostra o que seria feito")
    sp.add_argument("--com-status", action="store_true", help="também envia o campo status do arquivo")

    sp = sub.add_parser("conferir", help="compara arquivos locais com o banco")
    sp.add_argument("-v", "--verbose", action="store_true", help="lista também as tasks sincronizadas")
    return p


def main(argv: Optional[List[str]] = None) -> int:
    args = montar_parser().parse_args(argv)
    carregar_env(Path(args.env))
    try:
        cli = ClienteSupabase(*config_supabase())
        cli.usar_projeto(args.projeto or os.environ.get("DASHBOARD_AI_PROJECT") or PROJETO_PADRAO)
        return {"consulta": cmd_consulta, "exportar": cmd_exportar,
                "importar": cmd_importar, "conferir": cmd_conferir}[args.comando](cli, args)
    except ErroSync as e:
        print(f"erro: {e}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
