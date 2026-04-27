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

A fim de facilitar a leitura do histórico e a revisão do código:

* Cada `push` para uma branch deve ser composto por commits **devidamente descritivos**, especificando claramente as alterações feitas.
* O idioma padrão adotado para as mensagens de commit é o **PT-BR**.

---

## 🚀 Ciclo de Lançamento (Releases)

* Uma nova **Release** oficial da branch `main` será gerada e lançada conforme os ciclos de atividades forem concluídos no planejamento do projeto.
