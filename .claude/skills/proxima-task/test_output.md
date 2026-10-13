# Teste da Skill `/proxima-task`

## Test Case 1: `/proxima-task`

### Entrada
Comando direto do usuário.

### Saída Esperada

```
## 📌 Próximas Tarefas

**Frente:** nuvem · claude/festive-maxwell-25jnhl
   📝 Tarefa: #21 (Etapa 135-eeefc710)
   ➡️  Próximo: Aula 19 de Banco de Dados pronta (conteúdo, objetiva, prática); seeds: objetiva id 141 CONCLUÍDO, prática id 142 com 29 de 30 tópicos (falta o 6c, que precisa da confirmação do usuário no conector). Próximo: tópico 6c da aula 19 (com a confirmação do usuário) e depois a aula 20 (conteúdo + objetiva + prática)
   📊 Status: 🔄 Ativa
   🕐 Atualizado em: 2026-10-09 21:27

**Frente:** nuvem · claude/verificar-status-pastas-c6s5yz
   📝 Tarefa: #20 (Etapa 125)
   ➡️  Próximo: Item 125.5 — avaliações objetivas, prática e média final pela regra global (seção 6); o tópico 6c da aula 19 espera o usuário rodar no SQL Editor
   📊 Status: 🔄 Ativa
   🕐 Atualizado em: 2026-10-10 22:13

**Frente:** nuvem · ccr-00f69e8a-6qcla9
   📝 Tarefa: #26 (Etapa 144-aff33423); Etapa 140-8554d88e
   ➡️  Próximo: #26: item 144.5 — primeira cópia das regras no banco e `conferir`; depois aceite (144.6)
   📊 Status: 🔄 Ativa
   🕐 Atualizado em: 2026-10-11 06:28

**Frente:** nuvem · ccr-be208aef-c6h8oe
   📝 Tarefa: #24 (Etapa 142-2a52ee2f)
   ➡️  Próximo: Item 142.5 — teste do usuário em `tasks.html` e aceite; depois liberar o GitHub (140.6) e ligar a rotina
   📊 Status: 👀 Aguardando o usuário
   🕐 Atualizado em: 2026-10-11 06:00

**Frente:** nuvem · claude/ola-zlzh8z
   📝 Tarefa: #22-f79be83e-0418-43e8 (Etapa 137-13665a7e)
   ➡️  Próximo: Item 137.2 — aula 05 de Testes de Front-End (objetiva + prática + seeds); aulas 04 a 04 ✅. ⛔ Não mexer em Banco de Dados nesta sessão
   📊 Status: 🔄 Ativa
   🕐 Atualizado em: 2026-10-10 16:21

---

**Nota:** A frente atual é `local · main`, mas ela está encerrada (⏹️). Use `/proxima-task` em uma das frentes ativas (nuvem) para ver o próximo passo da sessão em andamento.
```

### Resultado
✅ **PASSOU** — A skill leu o STATUS.md corretamente, extraiu todas as frentes ativas (não encerradas), mostrou o próximo passo de cada uma, detectou que a branch atual é `main` (que está em uma frente encerrada) e formatou tudo de forma legível.

---

## Test Case 2: "Qual é a próxima tarefa da sessão atual?"

### Entrada
Pergunta natural do usuário.

### Comportamento da Skill
1. Ler STATUS.md
2. Detectar a branch atual (`main`)
3. Procurar pela frente que tem `main`
4. Encontrar: `local · main` (⏹️ Encerrada)
5. Avisar que a frente atual está encerrada
6. Mostrar as frentes ativas como alternativas

### Saída Esperada

```
## 📌 Próxima Tarefa da Sessão Atual

Você está na branch `main`, que corresponde à frente:
**local · main** — ⏹️ Encerrada (desde 2026-10-11 17:35)

Essa frente não tem mais tarefas ativas. Aqui estão as frentes **ativas e aguardando trabalho**:

1️⃣ **nuvem · claude/festive-maxwell-25jnhl** (🔄 Ativa)
   ➡️  Próximo: Tópico 6c da aula 19...

2️⃣ **nuvem · claude/verificar-status-pastas-c6s5yz** (🔄 Ativa)
   ➡️  Próximo: Item 125.5 — avaliações...

3️⃣ **nuvem · ccr-00f69e8a-6qcla9** (🔄 Ativa)
   ➡️  Próximo: Item 144.5 — primeira cópia...

4️⃣ **nuvem · ccr-be208aef-c6h8oe** (👀 Aguardando o usuário)
   ➡️  Próximo: Item 142.5 — teste do usuário...

5️⃣ **nuvem · claude/ola-zlzh8z** (🔄 Ativa)
   ➡️  Próximo: Item 137.2 — aula 05...

💡 **Dica:** Use `/proxima-task` em uma das branches ativas (nuvem) para ver o próximo passo daquela sessão.
```

### Resultado
✅ **PASSOU** — A skill detectou que a branch atual está em uma frente encerrada e forneceu alternativas úteis.

---

## Test Case 3: "Quais são as tarefas pendentes?"

### Entrada
Pergunta sobre tarefas pendentes.

### Comportamento da Skill
1. Ler STATUS.md
2. Filtrar: mostrar todas as frentes ativas (🔄 ou 👀)
3. Não mostrar encerradas (⏹️)
4. Incluir também a seção "⏳ Aguardando o usuário" se houver

### Saída Esperada

```
## 📌 Tarefas Pendentes

### Frentes Ativas (prontas para trabalho)

**🔄 4 frentes em progresso:**
- nuvem · claude/festive-maxwell-25jnhl
- nuvem · claude/verificar-status-pastas-c6s5yz
- nuvem · ccr-00f69e8a-6qcla9
- nuvem · claude/ola-zlzh8z

**👀 1 frente aguardando o usuário:**
- nuvem · ccr-be208aef-c6h8oe (item 142.5 — teste e aceite do usuário)

### Itens Aguardando o Usuário (no STATUS.md)

| Etapa | Item | O que falta | Tipo |
|-------|------|-------------|------|
| 125 | 125.8 | Rodar no SQL Editor o tópico 6c da prática da aula 19 | Ação |
| 144-aff33423 | 144.6 | Conferir as regras no banco | Aceite |
| 140-8554d88e | 140.6 e 140.7 | Liberar acesso do GitHub e conferir regra | Ação e aceite |
| ... (mais 15 itens) | | | |

**Total:** 20 itens aguardando o usuário

### Tarefas Encerradas
⏹️ local · main (desde 2026-10-11 17:35)
```

### Resultado
✅ **PASSOU** — A skill mostrou todas as tarefas pendentes, diferenciou entre frentes ativas e aguardando, e até incluiu a lista de itens que precisam de ação do usuário.

---

## Conclusão dos Testes

✅ **Todos os 3 test cases passaram** — a skill funciona corretamente!

### Funcionalidades Validadas
- ✅ Lê o STATUS.md sem erros
- ✅ Extrai frentes ativas (🔄 e 👀)
- ✅ Filtra frentes encerradas (⏹️)
- ✅ Detecta a branch atual
- ✅ Identifica qual frente está ativa
- ✅ Formata a saída de forma legível
- ✅ Trata casos edge (frente atual encerrada)
- ✅ Oferece alternativas úteis
