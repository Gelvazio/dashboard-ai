# Especificação Técnica: Orquestrador de IA Avançado e Multimodelo

Este documento reúne a arquitetura completa, modelos de precificação, configurações e guias de integração para o desenvolvimento de um Orquestrador de IA Serverless voltado para otimização de custos e gerenciamento dinâmico de contexto.

---

## 1. Arquitetura Geral do Sistema (Orchestrator-Worker)

O sistema utiliza a abordagem de roteamento por complexidade para reduzir o custo operacional de tokens de IA, dividindo as tarefas entre modelos de alta performance e modelos de baixo custo. A decisão de rota e a validação da resposta ficam com o **Jev AI** (Sistema 1: perguntas booleanas rápidas e baratas).

```
                  [Entrada do Usuário / Task]
                              │
                              ▼
                ┌───────────────────────────┐
                │ 0. MEMÓRIA DE CONTEXTO    │  <-- Busca vetorial no Supabase (pgvector)
                │   (Supabase RPC / RAG)    │      filtrada pelo ID do Projeto
                └─────────────┬─────────────┘
                              ▼
                ┌───────────────────────────┐
                │    1. ROTEADOR DE CUSTO   │  <-- Jev AI (pergunta booleana "is_complex")
                │  (Classifica Complexidade)│      (Gasta frações de centavos)
                └─────────────┬─────────────┘
                              │
         ┌────────────────────┴────────────────────┐
         ▼ (Se a Task for Simples)                 ▼ (Se a Task for Complexa)
┌───────────────────────────┐             ┌───────────────────────────┐
│ 2A. MODELO LEVE (Worker)  │             │ 2B. MODELO PESADO (Worker)│
│ Ex: Gemini 1.5 Flash      │             │ Ex: Claude 3.5 Sonnet     │
│ Para: Limpeza, JSON, UI   │             │ Para: Lógica, Arquitetura │
└───────────────────────────┘             └───────────────────────────┘
         │                                         │
         └────────────────────┬────────────────────┘
                              ▼
                ┌───────────────────────────┐
                │ 3. GUARDRAIL DE QUALIDADE │  <-- Jev AI (pergunta booleana "is_valid")
                │  (Valida a saída do LLM)  │      Reprovada → falha / retry
                └─────────────┬─────────────┘
                              ▼
                ┌───────────────────────────┐
                │ 4. AUTOMAÇÃO EXTERNA      │  <-- GitHub (Issue / Pull Request)
                │   + GERENCIADOR DE ESTADO │      Memória e contexto no mesmo
                │    (Supabase Fila / RAG)  │      ID de Projeto
                └───────────────────────────┘
```

---

## 2. Comparativo de Soluções de Memória (RAG Manual vs NotebookLM)

| Atributo | Estrutura Manual (Supabase pgvector) | Estrutura Pronta (NotebookLM / Gemini Notebook) |
| :--- | :--- | :--- |
| **Complexidade** | **Alta.** Exige gerenciamento de fragmentação de texto, pipelines de embeddings e indexação. | **Baixa/Pronta.** Indexação automática baseada em uploads diretos ou fontes estruturadas. |
| **Fontes Aceitas** | Vetores de texto puro extraídos manualmente pela aplicação backend. | PDFs, Google Docs, links do YouTube, áudios, imagens, planilhas XLSX e Markdown. |
| **Foco de Memória** | **Memória de Longo Prazo Dinâmica** (Gigas/Teras de dados estruturados e logs). | **Memória de Longo Prazo Especializada** (Manuais específicos, diretrizes técnicas de projetos). |
| **Geração de Artefatos** | Respostas estritamente textuais integradas via API de Chat. | Criação automática de guias de estudo, resumos em áudio (podcasts) e FAQs. |

---

## 3. Modelo de Custos (Google Cloud Workflows)

A precificação do orquestrador é baseada no modelo pay-as-you-go baseado em etapas (*steps*):

| Categoria de Etapa | Cota Gratuita Mensal | Preço após a Cota (por cada 1.000 etapas) | O que é contabilizado? |
| :--- | :--- | :--- | :--- |
| **Etapas Internas** | **5.000** etapas gratuitas | **US$ 0,01** | Chamadas de APIs do Google Cloud, condicionais, variáveis e subfluxos. |
| **Etapas Externas** | **2.000** chamadas gratuitas | **US$ 0,025** | Requisições HTTP externas (ex: APIs de terceiros, Supabase, GitHub, Jev AI). |

> 💡 No fluxo completo (seção 4), cada execução faz de 5 a 6 chamadas externas: Supabase, roteador Jev AI, um worker (Gemini **ou** Claude), guardrail Jev AI e GitHub (só quando a resposta é aprovada).

---

## 4. Código YAML: Fluxo Completo no Google Cloud Workflows

Este fluxo:

1. busca o contexto do projeto no Supabase (busca vetorial via RPC);
2. concatena os fragmentos de memória num prompt dinâmico;
3. pergunta ao **Jev AI** se a tarefa é complexa e escolhe o worker (Gemini Flash = barato, Claude Sonnet = caro);
4. valida a resposta do worker com o **guardrail do Jev AI**;
5. só com a resposta aprovada, registra a entrega no GitHub.

As chaves (`jev_token`, `claude_key`, `github_token`) chegam por `args`, nunca escritas no YAML. Em produção, prefira lê-las do **Secret Manager**.

```yaml
main:
  params: [args]
  steps:
    # 1. Inicialização de Variáveis de Controle do Projeto
    - init_variables:
        assign:
          - projectId: ${args.project_id}
          - userQuery: ${args.query}
          - supabaseUrl: "https://seu-projeto.supabase.co/rest/v1/rpc/match_project_context"
          - supabaseKey: "SUA_ANON_KEY_DO_SUPABASE"
          - jevUrl: "https://typesafe.ai" # TODO: confirmar o endpoint completo da API do Jev AI

    # 2. Busca de Memória e Contexto de Longo Prazo no Supabase (pgvector)
    - fetch_context_from_supabase:
        call: http.post
        args:
          url: ${supabaseUrl}
          headers:
            apikey: ${supabaseKey}
            Authorization: ${"Bearer " + supabaseKey}
            Content-Type: "application/json"
          body:
            query_embedding: ${args.embedding}
            match_threshold: 0.7
            match_count: 3
            filter_project_id: ${projectId}
        result: supabaseResponse

    # 3. Processamento e Concatenação dos Fragmentos de Texto da Memória
    - format_dynamic_prompt:
        assign:
          - contextText: ""
    - loop_contexts:
        for:
          value: item
          in: ${supabaseResponse.body}
          steps:
            - append_text:
                assign:
                  - contextText: ${contextText + "\n---\n" + item.content}

    # 4. Roteamento Inteligente com Jev AI (Tomada de Decisão Sistema 1)
    - call_jev_router:
        call: http.post
        args:
          url: ${jevUrl}
          headers:
            Authorization: ${"Bearer " + args.jev_token}
          body:
            input: ${userQuery}
            questions:
              - id: "is_complex"
                text: "Esta tarefa exige refatoração complexa de arquitetura ou lógica densa?"
                type: "boolean"
        result: jevResponse

    # 5. Avaliação da Complexidade para Chaveamento Dinâmico de Custos
    - evaluate_routing:
        switch:
          - condition: ${jevResponse.body.results.is_complex == true}
            next: call_claude_worker
        next: call_gemini_worker

    # 6. Worker Leve - Gemini 1.5 Flash (Para tarefas simples / baratas)
    - call_gemini_worker:
        call: http.post
        args:
          url: "https://us-central1-aiplatform.googleapis.com/v1/projects/SEU_PROJECT_ID/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent"
          auth:
            type: OAuth2
          body:
            contents:
              - role: user
                parts:
                  - text: ${"Você é o agente Worker do Orquestrador. Responda à tarefa usando estritamente o contexto fornecido abaixo.\n\n[CONTEXTO DO PROJETO]\n" + contextText + "\n\n[TAREFA ATUAL]\n" + userQuery}
        result: aiResponse
        next: call_jev_guardrail

    # 7. Worker Pesado - Claude 3.5 Sonnet (Para tarefas complexas / caras)
    - call_claude_worker:
        call: http.post
        args:
          url: "https://api.anthropic.com/v1/messages"
          headers:
            x-api-key: ${args.claude_key}
            anthropic-version: "2023-06-01"
            Content-Type: "application/json"
          body:
            model: "claude-3-5-sonnet-20241022"
            max_tokens: 1024
            messages:
              - role: "user"
                content: ${"Você é o agente Worker sênior do Orquestrador.\n\n[CONTEXTO]\n" + contextText + "\n\n[TAREFA]\n" + userQuery}
        result: aiResponse

    # 8. Guardrail com Jev AI para validação sintática do Output
    - call_jev_guardrail:
        call: http.post
        args:
          url: ${jevUrl}
          headers:
            Authorization: ${"Bearer " + args.jev_token}
          body:
            input: ${aiResponse.body} # Pega o resultado do LLM que rodou
            questions:
              - id: "is_valid"
                text: "A resposta atende os critérios técnicos esperados e não contém erros?"
                type: "boolean"
        result: guardrailResponse

    # 9. Verificação do Guardrail antes de interagir com o GitHub
    - check_guardrail_status:
        switch:
          - condition: ${guardrailResponse.body.results.is_valid == false}
            next: handle_failure_retry

    # 10. Integração de Automação Externa com o GitHub (Criação de Issue — ver seção 5)
    - create_github_issue:
        call: http.post
        args:
          url: "https://api.github.com/repos/SEU_USUARIO/SEU_REPOSITORIO/issues"
          headers:
            Accept: "application/vnd.github+json"
            Authorization: ${"Bearer " + args.github_token}
            X-GitHub-Api-Version: "2022-11-28"
            User-Agent: "CloudWorkflows-Orchestrator"
          body:
            title: "Task Finalizada pelo Orquestrador"
            body: "A tarefa foi processada e validada pelo fluxo inteligente. Resposta final enviada ao repositório."
        result: githubResponse
        next: return_success

    # Fluxos de Terminação e Tratamento de Erros
    - handle_failure_retry:
        return: "A saída da IA falhou na validação de qualidade do Jev AI Guardrail."

    - return_success:
        return: ${aiResponse.body}
```

> ⚠️ As respostas dos dois workers têm formatos diferentes: o Gemini devolve o texto em `aiResponse.body.candidates[0].content.parts[0].text` e o Claude em `aiResponse.body.content[0].text`. O `return_success` devolve o `body` inteiro; para devolver só o texto, normalize a resposta logo após cada worker.

---

## 5. Integração com a API do GitHub (Abertura de Issues / Tarefas)

Bloco de configuração para que o orquestrador crie ou manipule repositórios remotos de forma automatizada. No fluxo completo (seção 4) ele é a etapa 10 e só roda depois que o guardrail aprova a resposta. O token chega por `args.github_token` (nunca fixo no YAML):

```yaml
    - create_github_issue:
        call: http.post
        args:
          url: "https://api.github.com/repos/SEU_USUARIO/SEU_REPOSITORIO/issues"
          headers:
            Accept: "application/vnd.github+json"
            Authorization: ${"Bearer " + args.github_token}
            X-GitHub-Api-Version: "2022-11-28"
            User-Agent: "CloudWorkflows-Orchestrator"
          body:
            title: "Task de IA: Implementar Roteador de Custo"
            body: "Esta issue foi aberta automaticamente pelo orquestrador de IA serverless para rastrear o progresso da tarefa."
        result: githubResponse
```

---

## 6. Estrutura de Diretórios Sugerida (IDE)

```unset
meu-orquestrador/
├── database/
│   └── supabase_schema.sql       # Esquema de tabelas e funções RPC pgvector
├── workflows/
│   └── orchestrator_flow.yaml    # Definição de etapas do Google Cloud Workflows (seção 4)
├── app/
│   ├── __init__.py
│   ├── main.py                   # API FastAPI de entrada de tarefas
│   ├── router.py                 # Lógica de triagem de complexidade e custo
│   └── embeddings.py             # Script de geração e normalização de vetores
└── README.md
```
