# 🏋️‍♂️ Treino Exato

> Desenvolvimento de uma aplicação mobile para o uso de profissionais da saúde, atletas, frequentadores de academia e para quem deseja criar treinos e tirar dúvidas acerca de exercícios.

---

## 💻 Tecnologias Utilizadas

O projeto foi construído utilizando a seguinte stack de tecnologias:

* **React** (Frontend Mobile/Web)
* **TypeScript** (Tipagem estática)
* **Node.js** (Ambiente de execução)
* **Supabase** (Backend as a Service / Banco de Dados)

---

## 📂 Arquivos Pilares

A estrutura do projeto conta com configurações essenciais, incluindo:

* `📄 .env`: Arquivo destinado ao armazenamento de variáveis de ambiente (credenciais, chaves de API). **Atenção:** Este arquivo possui dados sensíveis e nunca deve ser commitado.
* `🙈 .gitignore`: Lista todos os arquivos e diretórios que **NÃO** serão sincronizados com as branches no GitHub (ex: `node_modules`, arquivos de build e o próprio `.env`).

---

## 🌿 Regras para Manejamento de Branches

Para manter a organização e a integridade do código, seguimos diretrizes rígidas de versionamento:

1.  **Proteção da Branch Principal:** A branch `main` **não** deve receber nenhum merge direto das branches auxiliares. É obrigatória a realização de uma **revisão de código (Code Review)** para atestar que a *Task* foi devidamente concluída sem quebrar a aplicação principal.
2.  **Uso Exclusivo:** Cada branch auxiliar é de uso restrito apenas ao seu respectivo desenvolvedor responsável.
3.  **Merge Centralizado:** O merge final para a branch `main` será realizado exclusivamente por uma única pessoa designada.

---
## 📝 Padrão de Commits

Para mantermos o histórico de versionamento limpo, rastreável e facilitar a revisão de código (Code Review), este projeto adota a especificação do **[Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/)**.

### 📌 Regras Gerais
* **Idioma:** O idioma padrão adotado para as mensagens de commit é o **Português (PT-BR)**.
* **Clareza e Contexto:** Cada `push` deve ser composto por commits **atômicos e devidamente descritivos**. Evite commits genéricos como *"alterações"*, especificando claramente o que foi feito.

### 🏗️ Estrutura do Commit

Sempre que realizar um commit, é obrigatório seguir a estrutura abaixo:

```text
<tipo>(<escopo>): <descrição>
```

### 🏷️ Tipos de Commits permitidos

| Tipo | Descrição | Exemplo de Uso |
| :--- | :--- | :--- |
| **`feat`** | Adiciona uma nova funcionalidade ao projeto. | Criação de uma nova tela ou rota de API. |
| **`fix`** | Corrige um bug ou comportamento indesejado. | Resolução de um erro de cálculo ou layout quebrado. |
| **`docs`** | Alterações exclusivas na documentação. | Atualização do `README.md` ou diagramas UML. |
| **`refactor`** | Refatoração de código (não adiciona feature nem corrige bug). | Melhoria de performance ou reorganização de pastas. |
| **`style`** | Mudanças de formatação (espaços, ponto e vírgula, indentação). | Aplicação de regras do Prettier ou ESLint. |
| **`test`** | Adição ou correção de testes automatizados. | Criação de testes unitários para um controller. |
| **`chore`** | Tarefas de manutenção, dependências ou build. | Atualização de pacotes (ex: via Yarn). |

### ✅ Exemplos Práticos

**🟢 Correto:**
> `feat(login): adicionar validação de e-mail no formulário`
> `fix(api): corrigir erro 500 na rota de cadastro de aluno`
> `docs: criar diagrama de sequência da página inicial`
> `chore: atualizar dependência do react-router-dom`

**🔴 Incorreto:**
> `atualização na tela de login` *(Falta tipo e formatação)*
> `fix(login) corrigido erro` *(Falta os dois pontos e a descrição está vaga)*
> `feat: Adicionado novas tabelas` *(Verbo conjugado no passado e letra maiúscula na descrição)*

## 🚀 Ciclo de Lançamento (Releases)

* Uma nova **Release** oficial da branch `main` será gerada e lançada conforme os ciclos de atividades forem concluídos no planejamento do projeto.

---

## Padrão da Documentação (Diagramas de Sequências/Classe, Casos de Uso)

Todas as instruções da padronização de nomenclatura a ser utilizada estão localizadas e descritas no arquivo [Guia de Padronização de Nomenclatura - Diagramas (UML_Análise).pdf](docs/engenharia-software-2/Guia%20de%20Padroniza%C3%A7%C3%A3o%20de%20Nomenclatura%20-%20Diagramas%20(UML_An%C3%A1lise).pdf).
