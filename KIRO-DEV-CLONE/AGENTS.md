# KIRO-DEV-CLONE — V2 do Dashboard AI

**Objetivo:** Criar uma versão 2 (clone) do projeto Dashboard AI para implementar novas funcionalidades específicas do Kiro.dev.

## Contexto

Esta é uma v2 do projeto Dashboard AI atual, operando como um clone independente mas compartilhando a mesma base de código.

## Implementação

### 1. Link no Menu

Adicionar um link no menu de navegação com o nome **"KIRO DEV CLONE"** que redireciona para a nova pasta/interface.

**Localização:**
- Componente de navegação: `src/components/` ou `src/views/`
- Adicionar item no menu principal (provavelmente em `src/views/index.ts` ou componente de navegação)

**Requisitos:**
- Nome exibido: "KIRO DEV CLONE"
- Redirecionamento: para a nova área/interface (a ser definida)
- Manter consistência visual com o menu atual

### 2. Nova Pasta/Estrutura

A implementação será feita na pasta `kiro-dev-clone/` e integrada ao projeto React.

**Estrutura sugerida:**
```
kiro-dev-clone/
├── AGENTS.md          (este arquivo)
├── STATUS.md          (status de implementação)
├── docs/              (documentação específica)
└── src/               (componentes específicos da v2)
```

### 3. Integração com o Projeto Atual

- Compartilhar as mesmas dependências do projeto principal
- Reutilizar componentes comuns quando possível
- Isolar funcionalidades específicas do Kiro.dev
- Manter compatibilidade com o banco de dados atual

## Próximos Passos

1. Definir a estrutura de navegação para o "KIRO DEV CLONE"
2. Criar componentes específicos da v2
3. Implementar funcionalidades do Kiro.dev
4. Testar integração com o menu principal

## Regras do Projeto Principal

Seguir as mesmas regras do `AGENTS.md` principal:
- Protocolo de trava no `task-principal.md`
- Commits com formato padrão
- Validação com `npm run typecheck`, `npm test`, `npm run build`
- Não usar `git push --force`
