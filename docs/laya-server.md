# Laya Server + Opus: classificação híbrida

Este guia descreve o servidor Laya configurado neste repositório e o classificador híbrido do
worker, que fica no servidor (fora de `src/`, para nada ir ao navegador):

| Arquivo | Papel |
|---|---|
| [`worker/laya.ts`](../worker/laya.ts) | `classificarLaya` e `statusLaya` (SUB-47.1), contrato do Laya 0.4.6 |
| [`worker/opus.ts`](../worker/opus.ts) | `classificarComOpus` (SUB-47.14), mesmo formato de resposta |
| [`worker/classificador.ts`](../worker/classificador.ts) | `classificar` (SUB-47.15): modos `laya`, `opus` e `hybrid` |

O uso dentro do grafo do worker é a SUB-47.12; até lá, o classificador existe mas nada o chama.

## O que é o Laya

O [Laya](https://github.com/NandhaKishorM/laya) é um mecanismo de decisões tipadas: recebe um estado
(por exemplo, o texto e os metadados de uma tarefa) e perguntas com critérios, e retorna respostas
como `choice`, `score` e `noul`. O projeto o usa como classificador local System-One: o modelo faz
uma passagem de inferência e não gera texto livre. O servidor HTTP oficial expõe, entre outros,
`POST /v1/systemone` e `GET /health`.

## Subir e parar o servidor

Pré-requisito: Docker Desktop instalado e iniciado. A configuração do Dashboard está em
[`docker-compose.laya.yml`](../docker-compose.laya.yml), usa CPU por padrão, publica a porta 8000
somente em `127.0.0.1` e mantém o cache de modelos num volume Docker.

No Windows, na raiz do repositório:

```bat
scripts\start-laya.bat
scripts\stop-laya.bat
```

Equivalente com Docker Compose:

```bash
docker compose -f docker-compose.laya.yml up -d --build laya-serve
docker compose -f docker-compose.laya.yml ps
docker compose -f docker-compose.laya.yml logs -f laya-serve
docker compose -f docker-compose.laya.yml down
```

O build usa `../dashboard-ai-claude-code-senai/laya` como contexto padrão, um checkout local da
fonte oficial na versão 0.4.6. Se estiver em outro local, defina `LAYA_SOURCE` no `.env` com o
caminho do checkout. A primeira compilação baixa as dependências da imagem; o primeiro pedido pode
baixar os pesos do modelo. Com `LAYA_PRELOAD=0`, configurado por padrão, a verificação de saúde do
serviço não significa que os pesos já estão carregados.

Confirme o endpoint de saúde e envie uma chamada de classificação:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/v1/systemone \
  -H 'content-type: application/json' \
  --data '{"state":{"task":"Corrigir erro no login"},"questions":{"nivel":{"type":"choice","instructions":"Qual o nível de esforço?","criteria":{"LEVE":"ajuste pequeno e isolado","MEDIO":"mudança com algumas partes","PESADO":"mudança ampla ou de alto risco"}}}}'
```

Se `LAYA_API_KEY` estiver configurada no serviço, envie também `Authorization: Bearer <chave>`.
Esse segredo protege o endpoint do Laya; é diferente da chave da API Anthropic usada pelo fallback.

## Configuração do classificador híbrido

O classificador lê estas variáveis no processo do worker (modelo em `.env.example`):

| Variável | Uso |
|---|---|
| `LAYA_SERVER_URL` | URL base do servidor; localmente, `http://localhost:8000`. |
| `LAYA_API_KEY` | Opcional: a mesma chave do serviço, quando ele exige bearer. |
| `LAYA_TIMEOUT_MS` | Opcional: tempo máximo por chamada ao Laya (padrão 60000 ms). |
| `CLASSIFICADOR_MODE` | `laya` usa só o Laya, `opus` usa só o Opus e `hybrid` começa no Laya e pode recorrer ao Opus. Padrão: `hybrid`; outro valor é erro. |
| `ANTHROPIC_API_KEY` | Chave secreta para as chamadas ao Opus quando esse modo for usado. |
| `OPUS_MODELO` / `OPUS_TIMEOUT_MS` | Opcionais: modelo (padrão `claude-opus-5-5`) e tempo máximo (padrão 60000 ms). |

O fluxo `hybrid` tenta o Laya primeiro. Se a menor `answer_confidence` das respostas ficar abaixo
de `0.7` (ou não vier), ou se o servidor falhar ou estourar o tempo, o classificador pede a decisão
ao Opus. Usa-se `answer_confidence` (a probabilidade da resposta dada) e **não** `confidence`,
que no Laya é a entropia normalizada. O limiar `0.7` é uma política deste projeto, não um limiar
universal do modelo. Se o Opus também falhar, vale a resposta do Laya marcada com
`baixaConfianca: true`; se não houver nenhuma resposta, `classificar` lança `ErroClassificador`
em vez de inventar um nível.

**Segredos:** `ANTHROPIC_API_KEY` e `LAYA_API_KEY` não podem usar prefixo `VITE_` nem ser embutidas
no bundle do navegador. Configure a chave Anthropic somente no servidor (arquivo `.env` local ou
variáveis de ambiente do ambiente de backend). O `worker/opus.ts` lê a chave só no servidor e não
a coloca em log nem em mensagem de erro.

## Custo, latência e monitoramento

O Laya roda na máquina que hospeda o Docker: não há cobrança de tokens por inferência local, mas há
custo de CPU/GPU, energia, armazenamento dos pesos e tempo de inicialização/download. O Opus é uma
chamada remota cobrada conforme a conta e a [tabela de preços da Anthropic](https://www.anthropic.com/pricing);
também depende da rede. No modo híbrido, somente as decisões de baixa confiança ou falhas do Laya
devem acionar o fallback. Não há benchmark de latência ou custo deste projeto; o resultado varia
com o hardware, os pesos carregados, o tamanho da tarefa e a rede.

Para monitorar o serviço, use `docker compose -f docker-compose.laya.yml ps` e consulte
`http://localhost:8000/health`. Para investigar inicialização ou erros, veja
`docker compose -f docker-compose.laya.yml logs -f laya-serve`. Cada decisão de `classificar`
traz `classificador` (`laya` ou `opus`), `confianca`, `tempoMs`, `motivoRevisao` (por que o Opus
foi chamado) e `baixaConfianca`.

## Solução de problemas

| Sintoma | O que conferir |
|---|---|
| Docker Compose não inicia | Abra o Docker Desktop e confira `docker info`. Verifique se `LAYA_SOURCE` aponta para o checkout do Laya e se a porta 8000 está livre. |
| Build ou primeira chamada demora | A imagem inclui PyTorch e o primeiro uso pode baixar pesos do Hugging Face. Consulte os logs e aguarde o download; o volume `model-cache` preserva os arquivos entre reinicializações. |
| `LAYA_SERVER_URL` retorna conexão recusada | Confira se o contêiner está em execução (`docker compose ... ps`), se o health endpoint responde e se a URL/porta são acessíveis a partir do processo que faz a chamada. |
| Resposta HTTP 401 do Laya | Se `LAYA_API_KEY` estiver definida, confirme que o cliente envia a mesma chave no cabeçalho Bearer. |
| Timeout ou baixo score | Confira os logs e a carga de CPU/RAM. O modo híbrido recorre ao Opus nesses casos; em modo `laya`, não há fallback. |
| Fallback Opus falha | Confira `ANTHROPIC_API_KEY` no ambiente de servidor, a validade da chave, a conectividade de saída e os limites da conta. Não coloque a chave em variável `VITE_*`. |

## Fonte oficial

Esta configuração segue a versão 0.4.6 do [repositório oficial do Laya](https://github.com/NandhaKishorM/laya/tree/v0.4.6),
incluindo o [guia oficial de Docker](https://github.com/NandhaKishorM/laya/blob/v0.4.6/docs/docker.md) e o
[README da versão 0.4.6](https://github.com/NandhaKishorM/laya/blob/v0.4.6/README.md). A API, o
health check e as variáveis do contêiner devem seguir essa fonte; a configuração específica do
Dashboard está em `docker-compose.laya.yml`.
