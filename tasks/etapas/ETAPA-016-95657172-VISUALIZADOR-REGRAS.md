## Etapa 016-95657172 — SUB-55: Visualizador de regras e tarefas lendo os `.md` direto (`.claude/rules/index.html`)

**Tarefa:** SUB-55 · **Pedido em:** 2026-10-13 16:04 · **Criada por:** Claude Code (Opus 5.5) (local · main)
**Pedido:** "leia o index.html em .claude/rules" → "ele deve ler as tarefas" → "tem como ler direto do markdown?"
→ "sim" (à proposta de ler os `.md` direto do GitHub, igual ao painel da raiz).
**Objetivo:** o `.claude/rules/index.html` (hoje uma cópia gerada no projeto `aulasenai`, com as regras e o
quadro de lá embutidos) passa a mostrar as regras e as tarefas **deste** projeto, lendo os `.md` na hora, sem
gerador e sem dados embutidos.

### Escopo

- **Entra:** `.claude/rules/index.html` (só estrutura) e `.claude/rules/visualizador/` (CSS e JS separados, regra
  de `codigo-solid.md`): visual e scripts do visualizador do aulasenai reaproveitados; leitura dos arquivos por
  `fonte.js` (local quando a página é servida por HTTP; senão `raw.githubusercontent.com` e jsDelivr da `main` —
  o repositório é público, conferido com HTTP 200 sem token); leitores em JS no lugar dos leitores Python
  (`leitor_regras.py`, `leitor_tarefas.py`); aba TASKS com as tarefas abertas (`STATUS.md`), as concluídas
  (`task_complete.md`), as frentes ativas pela coluna "Em uso por" (não há mais tabela de frentes, SUB-54) e os
  itens 👀 das etapas listadas em "🗂️ Etapas"; README com o uso.
- **Não entra:** gerador Python (não é copiado); painel da raiz (`index.html` da raiz) não muda; testes
  automatizados (regra do projeto); abrir navegador (regra do usuário).
- **Critério de pronto:** a página não tem dados embutidos nem menção a "Aulas SENAI"; os leitores, rodados no
  Node contra os arquivos deste repositório, devolvem as regras do `INDEX.md` e as tarefas do quadro; o usuário
  confere no navegador e dá o aceite.

### Riscos

| Risco | Plano B |
|---|---|
| Página aberta com duplo clique (`file://`) não lê arquivo local | Lê do GitHub (`main`), que é público; mensagem clara se a rede falhar |
| Mudança local ainda sem push não aparece | Esperado: toda entrega vai para a `main` na hora; a página mostra de onde leu |
| Não posso abrir navegador para conferir | Funções conferidas no Node contra os arquivos reais; conferência visual fica no aceite do usuário |
| Arquivo de regra fora do `INDEX.md` não aparece (no navegador não dá para listar pasta) | O `INDEX.md` já lista todas as regras (regra do próprio índice) |

### Decisões

| Data | Quem | Decisão |
|---|---|---|
| 2026-10-13 16:04 | Gelvazio | Aprovado no chat ("sim"): ler os `.md` direto do GitHub, igual ao painel da raiz, sem dados embutidos |

### SUB-55.1 — Estrutura: `index.html`, estilo e telas (abas, cartões, modal) sem dados embutidos

**Próximo passo:** nenhum (concluída).

- **Descrição:** `index.html` só com estrutura e `<link>`/`<script src>`; título "Dashboard AI"; os dados passam
  a ser preenchidos por carregamento assíncrono (`inicio.js`), com aviso de carregamento e de erro; frentes
  montadas a partir de `{Frente, Tarefa, desde, proximo}`.
- **Critérios de Aceitação:** sem `<style>`/`<script>` com conteúdo dentro do HTML; `node --check` em cada `.js`;
  funções ≤ 45 linhas; linhas ≤ 100 caracteres.
- **Entrega:** commit `feat(SUB-55.1)` · **Verificação:** `index.html` reescrito (título "Dashboard AI", sem dados
  embutidos, sem `<style>`/`<script>` com conteúdo, aviso de carregamento/erro, seção de frentes "coluna Em uso por");
  `visualizador/` com `estilo.css` (token `--cor-codigo` e `--cor-fundo-modal`, estilo `.aviso`), `markdown.js`,
  `app.js` (DADOS vazio, preenchido na leitura), `aba-regras.js`, `aba-tasks.js` (cartão de frente com
  `Frente`/`Tarefa`/`Em uso desde`) e `inicio.js` (leitura assíncrona com aviso de erro); `node --check` sem erro;
  nenhuma linha > 100 caracteres (medido em caracteres, não bytes); nenhuma função > 45 linhas.
  ⚠️ A página só fica funcional com a 55.2 a 55.4: o `inicio.js` chama `lerRegras()`, `lerTarefas()` e
  `ultimaFonteUsada()`, que nascem nelas (e os `<script>` delas entram no `index.html` em cada uma).

### SUB-55.2 — `fonte.js`: ler um arquivo do repositório (local, raw ou jsDelivr)

**Próximo passo:** nenhum (concluída).

- **Descrição:** constantes do repositório e da branch; `lerArquivo(caminho)` tenta o arquivo local (página
  servida por HTTP), depois `raw.githubusercontent.com`, depois jsDelivr, sem cache; devolve texto e fonte usada.
- **Critérios de Aceitação:** `node --check`; no Node, lê `tasks/STATUS.md` do GitHub e devolve a fonte.
- **Entrega:** commit `feat(SUB-55.2)` · **Verificação:** `visualizador/fonte.js` com `lerArquivo`,
  `lerArquivoOpcional` e `ultimaFonteUsada` (fontes: local só por HTTP, GitHub raw e jsDelivr da `main`, sem cache);
  `node --check` ok; rodado no Node (`vm`): `lerArquivo("tasks/STATUS.md")` leu 189 linhas com fonte
  "GitHub (main)" e `lerArquivoOpcional("nao/existe.md")` devolveu ""; linhas ≤ 100; `<script>` no `index.html`.

### SUB-55.3 — `leitor-regras.js`: regras do `INDEX.md` divididas em seções

**Próximo passo:** depois da 55.2.

- **Descrição:** porta do `leitor_regras.py` do aulasenai: categorias pelo `INDEX.md`, seções por `##` (fora de
  bloco de código), tipo (Proibição, Fluxo, Referência, Obrigatória); a lista de arquivos vem do `INDEX.md`.
- **Critérios de Aceitação:** no Node, contra os arquivos locais, devolve as seções de todos os arquivos do índice.
- **Entrega:** — · **Verificação:** —

### SUB-55.4 — `leitor-tarefas.js`: tarefas abertas e concluídas, frentes e itens 👀

**Próximo passo:** depois da 55.3.

- **Descrição:** porta do `leitor_tarefas.py`: "📌 Tarefas" do `STATUS.md` + "✅ Concluídas" do `task_complete.md`,
  com a etapa e o próximo passo de cada uma; frentes ativas = nomes em "Em uso por"; itens 👀 das etapas da tabela
  "🗂️ Etapas".
- **Critérios de Aceitação:** no Node, contra os arquivos locais, a contagem bate com o quadro.
- **Entrega:** — · **Verificação:** —

### SUB-55.5 — Documentar no `README.md` como abrir o visualizador

**Próximo passo:** depois da 55.4.

- **Descrição:** seção curta no `README.md`: o que a página mostra, de onde lê e como abrir (duplo clique ou
  servidor).
- **Critérios de Aceitação:** texto simples, com o link do arquivo.
- **Entrega:** — · **Verificação:** —

### SUB-55.6 — Aceite do usuário

**Próximo passo:** depois da 55.5, o usuário abre a página no navegador e confere as duas abas.

- **Descrição:** conferência visual (a IA não abre navegador).
- **Critérios de Aceitação:** aceite registrado nas Decisões desta etapa.
- **Entrega:** — · **Verificação:** —
