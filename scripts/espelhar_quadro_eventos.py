#!/usr/bin/env python3
"""Espelha o quadro Markdown (commits de trava/entrega) em eventos de `agent_events` (SUB-35).

Uso (SUB-35.43):
  python3 scripts/espelhar_quadro_eventos.py [--desde "2 hours ago"] [--projeto slug]   # só lista
  python3 scripts/espelhar_quadro_eventos.py --aplicar [--desde ...] [--projeto slug]  # envia
Com --aplicar, envia a `agent_events` via PostgREST com a service_role do `.env`
(SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY, como `sincronizar_tasks.py`), usando
`on_conflict=project_id,chave_idempotencia` e `Prefer: resolution=ignore-duplicates`:
reexecutar não duplica. Para agentes que só usam o quadro em Markdown.

Entrada: linhas de `git log --format='%H%x09%aI%x09%s'`.
Mapeamento:
  lock: assumindo sub-task SUB-X por <agente>        -> tipo `trava`
  feat(SUB-X): ... [— <agente>]                       -> tipo `commit`
  docs(board): concluir SUB-X ... [de <agente>]       -> tipo `fim`
Cada evento usa `chave_idempotencia = 'git:<sha>'` (reenviar não duplica).
"""
from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Iterable, List, Optional

AGENTE_DESCONHECIDO = "desconhecido"

_RE_LOCK = re.compile(r"^lock: assumindo sub-task (SUB-[\d.]*\d) por (.+?)\s*$", re.I)
_RE_FEAT = re.compile(r"^feat\((SUB-[\d.]*\d)\):\s*(.*?)\s*$", re.I)
_RE_FIM = re.compile(r"^docs\(board\):\s*concluir (SUB-[\d.]*\d)\b(.*)$", re.I)
_RE_AGENTE_FEAT = re.compile(r"\s+[—-]\s+([^—]+?)\s*$")
_RE_AGENTE_FIM = re.compile(r"\bde\s+(.+?)\s*$")


def _agente(texto: str | None) -> str:
    texto = (texto or "").strip()
    return texto[:120] if texto else AGENTE_DESCONHECIDO


def commits_para_eventos(linhas: Iterable[str]) -> list[dict]:
    """Converte linhas `sha<TAB>data ISO<TAB>assunto` em eventos de `agent_events`.

    Linhas vazias, malformadas ou de commits que não são trava/entrega são ignoradas.
    A ordem de entrada é preservada.
    """
    eventos: list[dict] = []
    for linha in linhas:
        partes = linha.rstrip("\r\n").split("\t", 2)
        if len(partes) != 3 or not partes[0].strip():
            continue
        sha, data, assunto = (p.strip() for p in partes)
        if m := _RE_LOCK.match(assunto):
            codigo, tipo, agente = m.group(1), "trava", _agente(m.group(2))
        elif m := _RE_FEAT.match(assunto):
            codigo, tipo = m.group(1), "commit"
            a = _RE_AGENTE_FEAT.search(m.group(2))
            agente = _agente(a.group(1) if a else None)
        elif m := _RE_FIM.match(assunto):
            codigo, tipo = m.group(1), "fim"
            a = _RE_AGENTE_FIM.search(m.group(2))
            agente = _agente(a.group(1) if a else None)
        else:
            continue
        eventos.append(
            {
                "tipo": tipo,
                "task_codigo": codigo,
                "agente": agente,
                "mensagem": assunto[:2000],
                "created_at": data,
                "metadados": {"sha": sha},
                "chave_idempotencia": f"git:{sha}",
            }
        )
    return eventos


# --------------------------------------------------------------------------- #
# CLI (SUB-35.43)
# --------------------------------------------------------------------------- #
RAIZ = Path(__file__).resolve().parent.parent
FORMATO_LOG = "%H%x09%aI%x09%s"
TAMANHO_LOTE = 500


def ler_git_log(desde: Optional[str] = None, repo: Path = RAIZ) -> List[str]:
    """Linhas do `git log` (mais antigas primeiro) no formato esperado por `commits_para_eventos`."""
    cmd = ["git", "-C", str(repo), "log", "--reverse", f"--format={FORMATO_LOG}"]
    if desde:
        cmd.append(f"--since={desde}")
    r = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if r.returncode != 0:
        raise RuntimeError(f"git log falhou: {r.stderr.strip()}")
    return r.stdout.splitlines()


def enviar_eventos(cli, eventos: List[dict]) -> int:
    """Envia em lotes para `agent_events` ignorando duplicados; retorna quantos foram enviados."""
    corpo = [dict(e, project_id=cli.project_id) for e in eventos]
    for i in range(0, len(corpo), TAMANHO_LOTE):
        cli._req("POST", "agent_events", {"on_conflict": "project_id,chave_idempotencia"},
                 corpo=corpo[i:i + TAMANHO_LOTE], prefer="resolution=ignore-duplicates,return=minimal")
    return len(corpo)


def montar_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Espelha commits de trava/entrega do quadro em agent_events.")
    p.add_argument("--desde", help='limite do git log (ex.: "2 hours ago", "2026-10-12")')
    p.add_argument("--projeto", help="slug do projeto (padrão: $DASHBOARD_AI_PROJECT ou 'default')")
    p.add_argument("--aplicar", action="store_true", help="envia ao Supabase (sem isso só lista)")
    p.add_argument("--env", default=str(RAIZ / ".env"), help="arquivo .env a carregar (padrão: .env na raiz)")
    p.add_argument("--repo", default=str(RAIZ), help="repositório git a ler (padrão: raiz deste repo)")
    return p


def main(argv: Optional[List[str]] = None) -> int:
    args = montar_parser().parse_args(argv)
    try:
        eventos = commits_para_eventos(ler_git_log(args.desde, Path(args.repo)))
    except RuntimeError as e:
        print(f"erro: {e}", file=sys.stderr)
        return 2
    for e in eventos:
        print(f"{e['created_at']}  {e['tipo']:<6}  {e['task_codigo']:<10}  {e['agente']}  ({e['chave_idempotencia'][:11]})")
    print(f"{len(eventos)} evento(s){'' if args.aplicar else ' (dry-run: use --aplicar para enviar)'}")
    if not args.aplicar or not eventos:
        return 0
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from sincronizar_tasks import PROJETO_PADRAO, ClienteSupabase, ErroSync, carregar_env, config_supabase

    carregar_env(Path(args.env))
    try:
        cli = ClienteSupabase(*config_supabase())
        cli.usar_projeto(args.projeto or os.environ.get("DASHBOARD_AI_PROJECT") or PROJETO_PADRAO)
        n = enviar_eventos(cli, eventos)
    except ErroSync as e:
        print(f"erro: {e}", file=sys.stderr)
        return 2
    print(f"enviado(s) {n} evento(s) ao projeto {cli.projeto!r} (duplicados ignorados)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
