# 🤖 DIRETRIZES DE AGENTES DE IA & PROTOCOLO DE CONCORRÊNCIA

> **AVISO A TODOS OS AGENTES DE IA (Claude, Gemini, Grok, Copilot, Antigravity, etc.):**
> Este repositório opera com fluxo autônomo baseado em fila atômica de tarefas e trava contra conflitos de edição.
> Siga rigorosamente as regras abaixo **ANTES** de executar qualquer código.

---

## 🔒 1. PROTOCOLO OBRIGATÓRIO DE CAPTURA DE TAREFA (LOCK EM 3 PARTES) E CONCORRÊNCIA

Todo e qualquer agente de IA (Claude, Gemini, Grok, Copilot, Antigravity, etc.) que chegar à fila de tarefas **DEVE SEGUIR RIGOROSAMENTE O FLUXO EM 3 PARTES ANTES DE MEXER NO CÓDIGO DA TAREFA**:

**CHECKLIST OBRIGATÓRIO ANTES DE ASSUMIR QUALQUER TAREFA:**
☐ [ ] Fiz `git pull --rebase origin main` **PRIMEIRO**?
☐ [ ] Li os arquivos ATUALIZADOS (quadro-task-principal.md e task-principal.md)?
☐ [ ] Verifiquei que a trava está LIVRE ou que minha task não conflita?
☐ [ ] Confirmei que todas as dependências estão `concluido`?
☐ [ ] Não tenho nenhum outro item travado (máximo 1 subtarefa ou 1 tarefa atômica por agente)?
☐ [ ] O item é uma subtarefa ou tarefa atômica (não uma tarefa-mãe com subtarefas)?
☐ [ ] Vou fazer commit + push do lock IMEDIATAMENTE antes de codificar?

⛔ **Se NÃO marcou todos os ☐ acima, NÃO assuma a tarefa.**

---

### 🔹 PARTE 1 — LER O QUADRO E IDENTIFICAR A TAREFA PENDENTE

⚠️ **ORDEM OBRIGATÓRIA DE EXECUÇÃO (NÃO PULAR PASSOS):**

✅ **PASSO 1 (CRÍTICO — PRIMEIRO):** Executar `git pull --rebase origin main` para garantir o estado mais recente do repositório.
   - ⛔ **NÃO** ler nenhum arquivo local antes deste comando
   - ⛔ **NÃO** assumir nenhuma tarefa sem garantir que está no estado mais recente
   - Se houver conflito de merge, resolver antes de prosseguir

✅ **PASSO 2 (SÓ DEPOIS DO GIT PULL):** Ler obrigatoriamente os arquivos ATUALIZADOS:
   - 📄 [`quadro-task-principal.md`](file:///c:/fontes/dashboard-ai/quadro-task-principal.md)
   - 📄 [`task-principal.md`](file:///c:/fontes/dashboard-ai/task-principal.md)

✅ **PASSO 3:** Conferir a seção **"🔒 TRAVA ATIVA NO MOMENTO"** em `quadro-task-principal.md`:
   - ⛔ **PROIBIÇÃO TOTAL DE CONFLITO:** Se já existir uma task com trava ativa ou status `EM EXECUÇÃO` associada a outro agente, **NENHUMA OUTRA IA PODE ASSUMIR AQUELA MESMA TAREFA**.

✅ **PASSO 4:** Localizar a próxima sub-task com status `pendente`:
   - Verificar se todas as dependências da sub-task estão com status `concluido`
   - ⛔ **NÃO** assumir uma tarefa cujas dependências não estejam 100% concluídas

---

### ⚠️ ERROS COMUNS A EVITAR (CAUSAM CONFLITOS)

❌ **LER ARQUIVOS LOCAIS ANTES DE GIT PULL:** Os arquivos podem estar desatualizados. Sempre fazer `git pull` primeiro.
❌ **ASSUMIR TAREFA SEM VERIFICAR TRAVAS:** Pode resultar em múltiplos agentes trabalhando na mesma tarefa.
❌ **IGNORAR DEPENDÊNCIAS:** Uma tarefa só pode ser assumida se todas as suas dependências estiverem `concluido`.
❌ **NÃO FAZER COMMIT/PUSH DO LOCK:** O lock não é válido até ser commitado e pushed para o remoto.

---

### 🔹 PARTE 2 — GRAVAR O BLOQUEIO NO QUADRO, FAZER COMMIT E PUSH IMEDIATOS
1. Gravar a tarefa como bloqueada no quadro para que nenhuma outra IA a pegue:
   - Em `quadro-task-principal.md`: marcar a trava como `OCUPADO`, preencher o código da sub-task, nome do agente e data/hora de início. Mover a sub-task para a seção `🔄 EM EXECUÇÃO`.
   - Em `task-principal.md`: mudar o status da sub-task para `em_execucao` e registrar o executor.
2. **Executar COMMIT e PUSH do bloqueio IMEDIATAMENTE (antes de criar código da tarefa):**
   ```bash
   git add quadro-task-principal.md task-principal.md
   git commit -m "lock: assumindo sub-task SUB-XX por [Nome do Agente]"
   git push origin main
   ```
   *Dessa forma, a main remota no GitHub é atualizada na hora, impedindo colisões de outros agentes.*

---

### 🔹 PARTE 3 — EXECUÇÃO, FINALIZAÇÃO, COMMIT E PUSH DA ENTREGA
1. Executar e validar o código da mini-task com qualidade.
2. Atualizar `task-principal.md`: alterar status para `concluido` e registrar a anotação técnica detalhada.
3. Atualizar `quadro-task-principal.md`:
   - Liberar a trava para `LIVRE`.
   - Mover a sub-task para a seção `✅ CONCLUÍDAS`.
   - Registrar no histórico a data/hora, o nome do agente, o código da sub-task, o SHA do commit e a nota do que foi feito.
4. **Executar COMMIT e PUSH da conclusão IMEDIATAMENTE:**
   ```bash
   git add <arquivos da tarefa> quadro-task-principal.md task-principal.md
   git commit -m "feat(SUB-XX): descrição do que foi implementado"
   git push origin main
   ```

---

## ⚖️ 1.1 REGRAS COMPLEMENTARES DE CONCORRÊNCIA (OBRIGATÓRIAS)

1. **Uma tarefa por agente, no máximo:**
   - Cada agente pode ter **no máximo 1 item travado** por vez: **1 subtarefa** (ex: `SUB-19.3`) **ou 1 tarefa atômica** (tarefa sem subtarefas, `Subtarefas: Nenhuma (atômica)`).
   - ⛔ É proibido travar uma tarefa-mãe que tenha subtarefas (status `pendente (aguardando subtarefas)`). Ela só é concluída quando todas as filhas estiverem `concluido`.
   - Só depois de concluir e fazer push da entrega (ou liberar a trava) o agente pode pegar o próximo item.
   - Exceção: o planejamento/subdivisão de tarefas pedido pelo usuário, que trava as tarefas-mãe apenas durante a edição do quadro e as libera no mesmo ciclo, sem escrever código.

2. **Push da trava recusado (corrida entre agentes):**
   - Se o `git push` do lock for recusado, executar `git pull --rebase origin main` e **reler o quadro**.
   - Se outro agente travou o mesmo item, **desfazer o seu lock local** e escolher outro item livre. Nunca sobrescrever a trava de outro agente.
   - ⛔ Nunca usar `git push --force`.

3. **Travas em paralelo:**
   - Vários agentes podem trabalhar ao mesmo tempo, **cada um em um item diferente**.
   - Cada agente registra sua trava em um bloco próprio `### 🔒 TRAVA ADICIONAL — <Nome da IA> — <SUB-XX>` em `quadro-task-principal.md`, e nunca edita o bloco de outro agente.
   - A proibição vale para o **mesmo item**: ninguém assume um item que já tem trava de outro agente.

4. **Travas só são liberadas pelo usuário:**
   - Não existe tarefa "abandonada": uma tarefa travada é uma tarefa que ainda não terminou.
   - ⛔ Nenhum agente pode liberar, assumir ou alterar a trava de outro agente por conta própria, independentemente do tempo sem commits.
   - Se uma trava estiver causando problemas, quem decide e libera manualmente é o **usuário**.

5. **Estados das subtarefas no quadro:**
   - 🟢 **livre:** `pendente`, sem trava e com todas as dependências `concluido`; qualquer agente pode pegar.
   - ⛓️ **bloqueada:** `pendente`, mas com alguma dependência ainda não concluída; ninguém pode pegar.
   - 🔒 **reservada:** pertence a uma tarefa-mãe travada por um agente; só esse agente pode pegar.
   - 🔄 **em execução:** travada por um agente.

6. **Tamanho máximo (~3 minutos):**
   - Cada subtarefa deve caber em cerca de **3 minutos** de trabalho de uma IA: 1 função, 1 método, 1 componente, 1 classe, 1 arquivo de teste ou 1 seção de documentação.
   - Se o agente perceber que o item é maior, deve **subdividi-lo** (seção 2) antes de codificar, em vez de entregar parcialmente.

7. **Commits limpos:**
   - Usar sempre `git pull --rebase origin main` (nunca merge) e adicionar **só os arquivos da tarefa** + quadro (nunca `git add .`).

---

## 🧩 2. SUBDIVISÃO EM SUBTAREFAS E CONTROLE DE DEPENDÊNCIAS

1. **Subdivisão Contínua (Granularidade Máxima):**
   - Qualquer tarefa ou subtarefa pode ser subdividida em tarefas menores (ex: `SUB-01.1`, `SUB-01.2`, `SUB-01.3`) caso o agente identifique etapas independentes.
   - Isso permite que qualquer IA assuma uma fração clara e objetiva do trabalho sem perder contexto.

2. **Declaração Obrigatória de Dependências e Subtarefas:**
   - Toda tarefa em [`task-principal.md`](file:///c:/fontes/dashboard-ai/task-principal.md) deve conter obrigatoriamente:
     - **`Depende de:`** Código das tasks que precisam estar `concluido` antes de iniciar (ex: `SUB-01` ou `Nenhuma`).
     - **`Subtarefas:`** Lista de subtarefas filhas em que ela se divide (ou `Nenhuma / Atômica`).
   - ⛔ **REGRA DE BLOQUEIO POR DEPENDÊNCIA:** Nenhuma IA pode assumir uma tarefa cujas dependências ainda não estejam 100% `concluido`.

---

## 🏷️ 3. IDENTIFICAÇÃO OBRIGATÓRIA DA IA EXECUTORA

Sempre que uma IA assumir uma sub-task, deve identificar explicitamente seu nome/modelo em todos os registros:
- **Exemplos de identificação:** `Claude Code`, `xAI (Grok)`, `Gemini (Antigravity)`, `Copilot / OpenAI`.
- **Onde registrar o nome da IA:**
  - 1. No campo `Executor:` em [`task-principal.md`](file:///c:/fontes/dashboard-ai/task-principal.md).
  - 2. No campo `Agente Responsável:` da Trava Ativa e na tabela em [`quadro-task-principal.md`](file:///c:/fontes/dashboard-ai/quadro-task-principal.md).
  - 3. Na mensagem de commit do lock: `git commit -m "lock: assumindo sub-task SUB-XX por [Nome da IA]"`.
  - 4. Na tabela de histórico de entregas e no commit da entrega final.

---

# 🧠 Plano de Implementação: Cérebro de Memória Persistente (Estilo Jev-Mem)
**Foco:** Ultra-rápido, baseado em primitivas estruturadas, custo zero de infraestrutura e consumo mínimo de tokens.
**Stack:** Claude Code / Antigravity + Vercel Serverless (Node/TS) + Supabase (Postgres + pgvector).

---

## 2. Arquitetura do Banco de Dados (Supabase)

Execute o script SQL abaixo no painel do seu Supabase para criar a estrutura de tabelas e habilitar a busca vetorial por proximidade.

> ℹ️ A versão consolidada e idempotente destes scripts fica na pasta [`database/`](database/README.md) (aplicar `01` → `04` em ordem). O trecho abaixo é a referência original do plano.

```sql
-- 1. Habilitar a extensão de busca vetorial
create extension if not exists vector;

-- 2. Criar a tabela principal de memórias canonicas
create table public.ai_memories (
    id uuid default gen_random_uuid() primary key,
    title text not null unique,
    content text not null, -- Armazenamento em Markdown limpo
    tags text[] default '{}'::text[],
    embedding vector(1536), -- Padrão OpenAI (text-embedding-3-small)
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Criar índice para busca vetorial acelerada (IVFFlat ou HNSW)
create index on public.ai_memories using hnsw (embedding vector_cosine_ops);

-- 4. Função RPC para busca híbrida acelerada (Evita processamento pesado no LLM)
create or replace function match_memories (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  content text,
  tags text[],
  similarity float
)
language sql stable
as $$
  select
    ai_memories.id,
    ai_memories.title,
    ai_memories.content,
    ai_memories.tags,
    1 - (ai_memories.embedding <=> query_embedding) as similarity
  from ai_memories
  where 1 - (ai_memories.embedding <=> query_embedding) > match_threshold
  order by ai_memories.embedding <=> query_embedding
  limit match_count;
$$;
```

---

## 3. Estrutura do Servidor MCP (Vercel Serverless)

O Claude Code precisa de respostas em formato JSON-RPC padrão do protocolo MCP. Crie o endpoint na Vercel utilizando a estrutura abaixo para processar os três verbos cognitivos principais.

> ℹ️ **Implementação real:** [`api/mcp.ts`](api/mcp.ts) (roteador JSON-RPC 2.0 / MCP Streamable HTTP) + [`api/_lib/`](api/_lib/) (registro de ferramentas). Diferente do exemplo abaixo, no MCP o método é sempre **`tools/call`** com o nome da ferramenta em **`params.name`** (não `tools/call/brain_store`), e toda resposta vai no envelope `{ "jsonrpc": "2.0", "id", "result" | "error" }`. O handshake `initialize` também é obrigatório. As primitivas `brain_store`/`brain_search`/`brain_delete` (SUB-07) estão em [`api/_lib/brain-tools.ts`](api/_lib/brain-tools.ts), com escopo por projeto (upsert por `project_id,title`, memória global com `project_id` nulo) e embeddings em `https://api.openai.com/v1/embeddings`; o acesso ao Supabase usa `@supabase/supabase-js` com a chave `service_role` ([`api/_lib/supabase.ts`](api/_lib/supabase.ts)); runtime Node.js 22+. O exemplo abaixo é apenas ilustrativo.

### Estrutura de Arquivos Recomendada
```text
📦 meu-mcp-brain
 ┣ 📂 api
 ┃ ┗ 📜 mcp.ts        # Endpoint principal Serverless
 ┣ 📜 package.json
 ┗ 📜 tsconfig.json
```

### Arquivo: `api/mcp.ts`
```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-client';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Apenas requisições POST são aceitas.' });
  }

  const { method, params } = req.body;

  try {
    switch (method) {
      // PRIMITIVA 1: ARMAZENAR (brain_store)
      case 'tools/call/brain_store': {
        const { title, content, tags } = params.arguments;
        
        // Gerar embedding leve (Ex: usando API gratuita do Gemini ou OpenAI barata)
        const embedding = await generateEmbedding(content);

        const { data, error } = await supabase
          .from('ai_memories')
          .upsert({ title, content, tags, embedding }, { onConflict: 'title' })
          .select();

        if (error) throw error;
        return res.json({ content: [{ type: 'text', text: `Memória "${title}" salva com sucesso.` }] });
      }

      // PRIMITIVA 2: PESQUISAR (brain_search) - O "Filtro Jev" Rápido
      case 'tools/call/brain_search': {
        const { query } = params.arguments;
        const queryEmbedding = await generateEmbedding(query);

        // Busca rápida por similaridade direto no banco (Sem gastar token de LLM caro)
        const { data: memories, error } = await supabase.rpc('match_memories', {
          query_embedding: queryEmbedding,
          match_threshold: 0.7,
          match_count: 3
        });

        if (error) throw error;

        const formattedResult = memories.map((m: any) => `[${m.title}]: ${m.content}`).join('\n\n');
        return res.json({ content: [{ type: 'text', text: formattedResult || 'Nenhuma memória relevante encontrada.' }] });
      }

      // PRIMITIVA 3: DELETAR (brain_delete)
      case 'tools/call/brain_delete': {
        const { title } = params.arguments;
        const { error } = await supabase.from('ai_memories').delete().eq('title', title);
        
        if (error) throw error;
        return res.json({ content: [{ type: 'text', text: `Memória "${title}" apagada.` }] });
      }

      // Listar Ferramentas disponíveis para o Claude Code reconhecer automaticamente
      case 'tools/list': {
        return res.json({
          tools: [
            { name: 'brain_store', description: 'Salva uma nova decisão ou contexto em Markdown', inputSchema: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } } }, required: ['title', 'content'] } },
            { name: 'brain_search', description: 'Busca memórias antigas relevantes para a tarefa atual', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
            { name: 'brain_delete', description: 'Remove uma memória pelo título', inputSchema: { type: 'object', properties: { title: { type: 'string' } }, required: ['title'] } }
          ]
        });
      }

      default:
        return res.status(404).json({ error: 'Método não encontrado' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// Helper para gerar embeddings usando a API de sua escolha
async function generateEmbedding(text: string): Promise<number[]> {
  // Exemplo com OpenAI text-embedding-3-small (Custo insignificante: \$0.00002 por 1k tokens)
  const response = await fetch('https://openai.com', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input: text, model: 'text-embedding-3-small' })
  });
  const json = await response.json();
  return json.data[0].embedding;
}
```

---

## 4. Ativação no Terminal (Claude Code)

Após realizar o deploy do código acima na Vercel e configurar as variáveis de ambiente (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `OPENAI_API_KEY`), ative a sua memória compartilhada direto no Claude Code rodando o comando:

```bash
claude mcp add meu-brain-barato https://vercel.app
```
