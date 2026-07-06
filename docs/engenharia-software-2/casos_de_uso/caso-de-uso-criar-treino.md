# Casos de Uso: Criar Treino

**Atores:** Instrutor

**Pré-Condição:** O Instrutor deve estar autenticado no sistema e possuir pelo menos um aluno vinculado à sua conta.

**Trigger:** O Instrutor decide prescrever um novo treino para um de seus alunos a partir da Dashboard principal.

## Fluxo Principal

1. Instrutor acessa a tela de listagem de alunos (Home do Personal);
2. Sistema exibe a lista de alunos vinculados ao Instrutor;
3. Instrutor seleciona o aluno desejado;
4. Sistema exibe o perfil detalhado do aluno;
5. Instrutor pressiona o botão "CRIAR";
6. Sistema exibe a tela com os treinos modelo disponíveis;
7. Instrutor seleciona o treino modelo desejado e confirma a ação;
8. Sistema associa o treino ao aluno, exibe mensagem de sucesso e retorna à tela de listagem de alunos;

## Fluxo Alternativo (A1) — Nenhum treino modelo disponível

- A1.1. No passo 6, sistema não encontra treinos modelo cadastrados;
- A1.2. Sistema exibe mensagem de aviso ao Instrutor;
- A1.3. Retorna ao passo 4;

## Fluxo de Exceção (E1) — Nenhum aluno vinculado

- E1.1. No passo 2, o sistema identifica que não há alunos vinculados ao Instrutor;
- E1.2. Sistema exibe a mensagem "Nenhum aluno cadastrado";
- E1.3. Caso de uso encerrado (o Instrutor permanece na tela, mas não pode prosseguir);

## Fluxo de Exceção (E2) — Falha na Associação do Treino

- E2.1. No passo 8, ocorre uma falha de comunicação com o servidor ao tentar associar o treino;
- E2.2. Sistema não salva a associação e exibe mensagem "Erro ao cadastrar treino. Tente novamente.";
- E2.3. Instrutor permanece na tela de seleção de treinos modelo, podendo tentar novamente ou cancelar;


