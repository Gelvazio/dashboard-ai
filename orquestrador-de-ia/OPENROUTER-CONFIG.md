# OpenRouter Auto Router + Jev (TypeSafe AI) — Guia de Configuração

**Página do modelo:** https://openrouter.ai/openrouter/auto#apps
**Documento relacionado:** [`ORQUESTRADOR-DE-IA.md`](ORQUESTRADOR-DE-IA.md) (tarefa `SUB-46` no quadro, 🔒 travada até decisão do usuário)
**Pesquisado em:** 2026-10-13 — confira preços e parâmetros na documentação oficial antes de usar.

Este guia mostra como usar o **Auto Router do OpenRouter** para escolher o modelo de IA mais barato que dá conta da
tarefa e como encaixar o **Jev** (TypeSafe AI) como **roteador de política** e **guardrail** (validação da resposta).
Juntos, os dois cobrem as etapas 1 a 3 do `ORQUESTRADOR-DE-IA.md` sem precisar de Google Cloud Workflows.

---

## 1. Visão geral: quem faz o quê

| Peça | Papel | Gera texto? | Custo |
|---|---|---|---|
| **Jev** (`jev-latest`) | Responde perguntas tipadas sobre a tarefa (sim/não, escolha, nota) com probabilidade calibrada | ❌ Não | US$ 0,042 por milhão de tokens de entrada; saída não é cobrada |
| **OpenRouter Auto** (`openrouter/auto`) | Classifica o pedido e manda para o modelo mais adequado dentro da faixa de custo | ✅ Sim (pelo modelo escolhido) | Sem taxa do roteador; paga o preço do modelo escolhido |

```
 [Tarefa] ─► (1) Jev: "qual faixa de custo?"  ──► cost_tier = low | medium | high
                                                  │
           (2) OpenRouter Auto (openrouter/auto + cost_tier) ──► resposta + campo "model"
                                                  │
           (3) Jev guardrail: "a resposta atende?" ── sim (≥ 0,8) ──► entrega
                                                  └── não ──► repete 1 faixa acima (máx. 1 vez)
```

> 💡 O Auto Router **já classifica** o tipo de tarefa sozinho (cerca de 30 tipos, ex.: `code:debugging`, `math`). O Jev
> entra para **a sua política** (ex.: "mexe em banco? então nunca use a faixa `low`") e para **conferir a resposta**,
> algo que o OpenRouter não faz.

---

## 2. Pré-requisitos

1. **Conta e créditos no OpenRouter:** criar a chave em https://openrouter.ai/settings/keys. Recomendado: definir um
   **limite de gasto** na própria chave.
2. **Conta no TypeSafe AI:** criar a chave em `console.typesafe.ai/settings/keys`.
3. **Variáveis de ambiente** (nunca no código nem no Git — no Vercel, em *Settings → Environment Variables*):

   ```bash
   OPENROUTER_API_KEY=...
   TYPESAFE_API_KEY=...
   ```

---

## 3. OpenRouter Auto Router

### 3.1 Chamada mínima

Basta trocar o nome do modelo para `openrouter/auto`. O endpoint é o padrão compatível com OpenAI:

```bash
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openrouter/auto",
    "messages": [{ "role": "user", "content": "Explique o que é uma função RPC no Supabase" }]
  }'
```

### 3.2 Controlando custo e modelos (plugin `auto-router`)

```bash
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openrouter/auto",
    "messages": [{ "role": "user", "content": "Refatore esta função para usar return early: ..." }],
    "plugins": [{
      "id": "auto-router",
      "cost_tier": "low",
      "allowed_models": ["google/*", "anthropic/*", "openai/gpt-5*"],
      "excluded_models": ["openai/gpt-4o"]
    }],
    "provider": { "max_price": { "prompt": 1, "completion": 5 } }
  }'
```

| Parâmetro | O que faz | Observação |
|---|---|---|
| `cost_tier` | Faixa de custo: `low`, `medium`, `high`, `xhigh`, `max` | **Padrão `low`.** É uma **faixa**, não um teto: `medium` exclui também os modelos mais baratos que a faixa |
| `allowed_models` | Só considera esses modelos; aceita curinga (`anthropic/*`, `openai/gpt-5*`) | Vazio = todos os candidatos |
| `excluded_models` | Remove modelos; mesma sintaxe | Vence o `allowed_models`. Se não sobrar nenhum → erro 404 |
| `session_id` | Mantém a conversa no mesmo modelo enquanto ele continuar entre os melhores | Útil em chat com vários turnos |
| `provider.max_price` | Teto de preço por milhão de tokens | Continua valendo junto com o Auto Router |
| `cost_quality_tradeoff` | Parâmetro antigo | Obsoleto; se vier com `cost_tier`, vale o `cost_tier` |

> ⚠️ No `openrouter/auto-beta` o id do plugin é `auto-beta-router`. Configuração com o id errado é **ignorada sem
> erro**. Os padrões da conta podem ser salvos na página *Routing* do OpenRouter.

### 3.3 Como saber qual modelo respondeu e quanto custou

- **Modelo escolhido:** campo `model` da resposta (ex.: `"model": "anthropic/claude-sonnet-4.5"`). Também aparece em
  *Activity* no painel.
- **Custo:** `usage.cost` (e `prompt_tokens`, `completion_tokens`).
- **Tipo de tarefa detectado:** enviar o header `X-OpenRouter-Metadata: enabled` e ler
  `openrouter_metadata.pipeline` → `data.task_type`.

Registre sempre `model` e `usage.cost`. No Dashboard AI, o lugar natural é um evento `agent_event` do tipo `progresso`
(ver seção 4 do `AGENTS.md`).

### 3.4 Limitações

- Exige o formato `messages` (não aceita `prompt`).
- Streaming (`"stream": true`), ferramentas (`tools`) e `response_format` funcionam, desde que o modelo escolhido os
  suporte. Se não suportar, a chamada pode dar erro 400. Nesse caso, restrinja com `allowed_models`.
- Erros: `402` créditos insuficientes · `403` limite de gasto atingido · `404` nenhum modelo disponível · `429` limite
  de taxa (tentar de novo com espera crescente) · `502` falha no provedor (não é cobrada).

---

## 4. Jev (TypeSafe AI)

O Jev **não é um LLM**: ele não escreve texto. Ele recebe um `state` (o contexto, em texto ou JSON) e **perguntas
tipadas**, e devolve uma probabilidade calibrada para cada uma, todas numa única chamada.

| Tipo | Para que serve | Resposta |
|---|---|---|
| `noul` | Sim/não | `answers.<id>.noul` (0 a 1) |
| `choice` | Escolher entre rótulos (até 255) | `answers.<id>.choice`, `confidence`, `probabilities` |
| `score` | Nota numa escala ordenada (2 a 10 níveis) | `answers.<id>.score` (pode ser fracionário), `confidence`, `legend` |

### 4.1 Chamada direta

```bash
curl -X POST https://api.typesafe.ai/v1/systemone \
  -H "Authorization: Bearer $TYPESAFE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "jev-latest",
    "state": "Task: add a NOT NULL column to the projects table and update the RLS policy.",
    "questions": {
      "cost_tier": {
        "type": "choice",
        "instructions": "Which model cost tier is needed to do this task correctly?",
        "criteria": {
          "low": "Simple edits, formatting, JSON, short answers",
          "medium": "Normal coding in one or two files",
          "high": "Architecture, security, database, RLS or multi-file refactoring"
        }
      },
      "touches_database": {
        "type": "noul",
        "instructions": "Does this task change database schema, SQL, RLS or production data?"
      }
    }
  }'
```

Resposta (formato):

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "cost_tier": { "type": "choice", "choice": "high", "confidence": 0.93,
                   "probabilities": { "low": 0.01, "medium": 0.06, "high": 0.93 } },
    "touches_database": { "type": "noul", "noul": 0.98 }
  },
  "usage": { "input_tokens": 142, "output_tokens": 0 }
}
```

### 4.2 Pelo Vercel AI Gateway (opcional)

O Jev também está no Vercel AI Gateway como `typesafe-ai/jev`, **só pelo AI SDK** (versão 7 ou superior), com a
função `experimental_evaluate`. Ali o tipo sim/não se chama `boolean` e a resposta vem em `probability`:

```ts
import { experimental_evaluate as evaluate } from 'ai';

const resultado = await evaluate({
  model: 'typesafe-ai/jev',
  state: 'The agent answered with a complete SQL migration.',
  questions: { completa: { type: 'boolean', instructions: 'Is the answer complete and correct?' } },
});
// resultado.answers.completa -> { type: 'boolean', probability: 0.97 }
```

### 4.3 Cuidados

- **Escreva `instructions` e `criteria` em inglês:** é o idioma preferido; em outros idiomas a precisão cai. O `state`
  pode ficar em português, mas o ideal é o inglês.
- **Limites:** 64k tokens por requisição (até 32k para `state` + a pergunta mais longa), só texto, 1.200 requisições
  por minuto.
- Uma pergunta **não** enxerga a resposta de outra na mesma chamada.
- A probabilidade mede a **confiança do Jev**, não garante que a resposta está certa. Defina os limites (ex.: 0,8) e
  ajuste com testes reais.
- Erros: `401` chave inválida · `422` corpo inválido (ex.: `score` com um nível só) · `429` limite de taxa · `529`
  serviço sobrecarregado (tentar de novo com espera).

---

## 5. Integração completa (TypeScript, Node 22+)

Exemplo para o padrão do projeto (funções pequenas, nomes em português, constantes no topo). Ele serve de referência
para a `SUB-46` e **não está ligado a nenhum endpoint**.

```ts
// orquestrador.constantes.ts
export const URL_OPENROUTER = 'https://openrouter.ai/api/v1/chat/completions';
export const URL_JEV = 'https://api.typesafe.ai/v1/systemone';
export const MODELO_ROTEADOR = 'openrouter/auto';
export const MODELO_JEV = 'jev-latest';
export const FAIXAS_CUSTO = ['low', 'medium', 'high'] as const;
export const LIMITE_APROVACAO = 0.8;
export const LIMITE_BANCO = 0.5;
export const MODELOS_PERMITIDOS = ['google/*', 'anthropic/*', 'openai/gpt-5*'];

export type FaixaCusto = (typeof FAIXAS_CUSTO)[number];
```

```ts
// jev.cliente.ts
import { URL_JEV, MODELO_JEV } from './orquestrador.constantes';

/**
 * Envia perguntas tipadas ao Jev e devolve as respostas.
 * @param {{ estado: string, perguntas: object, chave: string }} entrada - Contexto, perguntas e chave da API.
 * @returns {Promise<Record<string, any>>} Objeto `answers` do Jev.
 * @throws {Error} Se a API responder com erro.
 */
export async function perguntarAoJev({ estado, perguntas, chave }) {
  const resposta = await fetch(URL_JEV, {
    method: 'POST',
    headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODELO_JEV, state: estado, questions: perguntas }),
  });
  if (!resposta.ok) throw new Error(`Jev respondeu ${resposta.status}`);

  const corpo = await resposta.json();
  return corpo.answers;
}
```

```ts
// openrouter.cliente.ts
import { URL_OPENROUTER, MODELO_ROTEADOR, MODELOS_PERMITIDOS } from './orquestrador.constantes';

/**
 * Executa a tarefa no Auto Router do OpenRouter dentro da faixa de custo pedida.
 * @param {{ tarefa: string, faixa: string, chave: string }} entrada - Texto da tarefa, faixa e chave.
 * @returns {Promise<{ texto: string, modelo: string, custo: number }>} Resposta, modelo usado e custo.
 * @throws {Error} Se a API responder com erro.
 */
export async function executarNoRoteador({ tarefa, faixa, chave }) {
  const resposta = await fetch(URL_OPENROUTER, {
    method: 'POST',
    headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODELO_ROTEADOR,
      messages: [{ role: 'user', content: tarefa }],
      plugins: [{ id: 'auto-router', cost_tier: faixa, allowed_models: MODELOS_PERMITIDOS }],
    }),
  });
  if (!resposta.ok) throw new Error(`OpenRouter respondeu ${resposta.status}`);

  const corpo = await resposta.json();
  return { texto: corpo.choices[0].message.content, modelo: corpo.model, custo: corpo.usage?.cost ?? 0 };
}
```

```ts
// orquestrador.servico.ts
import { FAIXAS_CUSTO, LIMITE_APROVACAO, LIMITE_BANCO, type FaixaCusto } from './orquestrador.constantes';
import { perguntarAoJev } from './jev.cliente';
import { executarNoRoteador } from './openrouter.cliente';

const PERGUNTAS_ROTA = {
  cost_tier: {
    type: 'choice',
    instructions: 'Which model cost tier is needed to do this task correctly?',
    criteria: {
      low: 'Simple edits, formatting, JSON, short answers',
      medium: 'Normal coding in one or two files',
      high: 'Architecture, security, database, RLS or multi-file refactoring',
    },
  },
  touches_database: {
    type: 'noul',
    instructions: 'Does this task change database schema, SQL, RLS or production data?',
  },
};

/**
 * Decide a faixa de custo pela política: tarefa de banco nunca usa a faixa mais barata.
 * @param {Record<string, any>} respostas - Respostas do Jev para PERGUNTAS_ROTA.
 * @returns {FaixaCusto} Faixa de custo a usar.
 */
function decidirFaixa(respostas): FaixaCusto {
  const mexeNoBanco = respostas.touches_database.noul >= LIMITE_BANCO;
  if (mexeNoBanco) return 'high';
  return respostas.cost_tier.choice;
}

/**
 * Pergunta ao Jev se a resposta resolve a tarefa.
 * @param {{ tarefa: string, texto: string, chave: string }} entrada - Tarefa, resposta do modelo e chave.
 * @returns {Promise<boolean>} true se a probabilidade de aprovação atingir o limite.
 */
async function respostaAprovada({ tarefa, texto, chave }) {
  const respostas = await perguntarAoJev({
    estado: { task: tarefa, answer: texto },
    perguntas: {
      is_valid: { type: 'noul', instructions: 'Does the answer fully and correctly solve the task?' },
    },
    chave,
  });
  return respostas.is_valid.noul >= LIMITE_APROVACAO;
}

/**
 * Sobe uma faixa de custo, sem passar da maior faixa disponível.
 * @param {FaixaCusto} faixa - Faixa atual.
 * @returns {FaixaCusto} Próxima faixa.
 */
function subirFaixa(faixa: FaixaCusto): FaixaCusto {
  const indice = Math.min(FAIXAS_CUSTO.indexOf(faixa) + 1, FAIXAS_CUSTO.length - 1);
  return FAIXAS_CUSTO[indice];
}

/**
 * Orquestra a tarefa: rota pelo Jev, execução no Auto Router e guardrail, com no máximo 1 nova tentativa.
 * @param {{ tarefa: string, chaveJev: string, chaveOpenRouter: string }} entrada - Tarefa e chaves.
 * @returns {Promise<{ texto: string, modelo: string, custo: number, aprovada: boolean }>} Resultado final.
 */
export async function orquestrarTarefa({ tarefa, chaveJev, chaveOpenRouter }) {
  const respostasRota = await perguntarAoJev({ estado: tarefa, perguntas: PERGUNTAS_ROTA, chave: chaveJev });
  const faixaInicial = decidirFaixa(respostasRota);

  const primeira = await executarNoRoteador({ tarefa, faixa: faixaInicial, chave: chaveOpenRouter });
  const primeiraAprovada = await respostaAprovada({ tarefa, texto: primeira.texto, chave: chaveJev });
  if (primeiraAprovada) return { ...primeira, aprovada: true };

  const segunda = await executarNoRoteador({ tarefa, faixa: subirFaixa(faixaInicial), chave: chaveOpenRouter });
  const segundaAprovada = await respostaAprovada({ tarefa, texto: segunda.texto, chave: chaveJev });
  return { ...segunda, custo: primeira.custo + segunda.custo, aprovada: segundaAprovada };
}
```

**Custo do fluxo:** duas chamadas ao Jev (rota + guardrail) custam frações de centavo (US$ 0,042 por milhão de
tokens). O custo real é o do modelo escolhido pelo OpenRouter. Se a resposta for reprovada, o fluxo paga uma segunda
execução, uma faixa acima.

---

## 6. Ligando ao `ORQUESTRADOR-DE-IA.md`

| Etapa do orquestrador | Com OpenRouter + Jev |
|---|---|
| 0. Memória de contexto | Continua no Supabase: buscar com `brain_search` / RPC `match_memories` e pôr o resultado no início da `tarefa` |
| 1. Roteador de custo | Jev (`cost_tier` + `touches_database`) → `cost_tier` do Auto Router |
| 2A/2B. Workers leve e pesado | Um único `openrouter/auto`; a faixa decide se cai num modelo barato ou forte |
| 3. Guardrail | Jev (`is_valid`, `noul` ≥ 0,8) |
| 4. Automação externa | GitHub / quadro / `agent_event`, como já descrito |

> ✅ **YAML do `ORQUESTRADOR-DE-IA.md` corrigido (2026-10-13):** as etapas `call_jev_router` e `call_jev_guardrail`
> usavam um formato que não existe na API do Jev (`input` + lista `questions` com `text`/`type: boolean`, resposta em
> `results.is_complex`). Agora seguem o formato da seção 4.1: endpoint `https://api.typesafe.ai/v1/systemone`, campo
> `state`, `questions` como **objeto** com `type: noul` e `instructions`, e decisão por limite sobre
> `answers.<id>.noul` (`complexThreshold` = 0,5 e `validThreshold` = 0,8).

---

## 7. Fontes

- OpenRouter — Auto Router: https://openrouter.ai/openrouter/auto e
  https://openrouter.ai/docs/guides/routing/routers/auto-router
- OpenRouter — referência de Chat Completions:
  https://openrouter.ai/docs/api/api-reference/chat/create-a-chat-completion
- Jev — guia da Apidog (endpoint, formato, preço, limites): https://apidog.com/fr/blog/what-is-jev/
- Jev — cliente `typesafe` da biblioteca Ax: https://tessl.io/registry/skills/github/ax-llm/ax/ax-typesafe
