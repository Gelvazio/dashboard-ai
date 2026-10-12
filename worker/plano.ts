import { z } from 'zod';

/**
 * Monta o prompt para o modelo gerar um plano de execução (SUB-28.31).
 * Inclui a instrução da task, contexto de memórias relevantes (se disponível)
 * e instruções de formato (passos com ferramenta, argumentos, sensível, critério).
 */
export function montarPromptPlano(estado: {
  instrucao: string;
  resultados: Record<string, unknown>;
}): string {
  const { instrucao, resultados } = estado;

  let prompt = `# Instrução da Task

${instrucao}

`;

  // Contexto de memórias (se houver resultados de brain_search)
  const contextoMemoria = resultados['brain_search'];
  if (Array.isArray(contextoMemoria) && contextoMemoria.length > 0) {
    prompt += `# Contexto de Memórias Relevantes

`;
    for (const mem of contextoMemoria) {
      if (typeof mem === 'object' && mem !== null && 'title' in mem && 'content' in mem) {
        prompt += `## ${mem.title}
${mem.content}

`;
      }
    }
  }

  prompt += `# Plano de Execução

Gere um plano de execução em JSON com o seguinte formato:
{
  "passos": [
    {
      "ferramenta": "nome_da_ferramenta",
      "argumentos": { ... },
      "sensivel": false,
      "criterio": "descrição do sucesso"
    }
  ]
}

Ferramentas disponíveis:
- brain_search: busca memórias por similaridade
- brain_store: salva nova memória
- brain_delete: exclui memória
- task_list: lista tasks do projeto

Para passos sensíveis (que alteram dados irreversivelmente), defina "sensivel": true.
O critério deve ser uma descrição clara de quando o passo é considerado bem-sucedido.
`;

  return prompt;
}

export const PlanoSchema = z.object({
  passos: z.array(
    z.object({
      ferramenta: z.string(),
      argumentos: z.record(z.unknown()),
      sensivel: z.boolean(),
      criterio: z.string(),
    }),
  ),
});
