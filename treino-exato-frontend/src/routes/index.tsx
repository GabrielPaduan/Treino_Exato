/** Impotações de tipos e funções necessárias para a definição das rotas da aplicação.
 *
 * Routes e Route são componentes do React Router que permitem definir as rotas da aplicação.
 * Navigate é um componente do React Router que permite redirecionar o usuário para uma rota específica.
 * LoginView é um componente que representa a página de login da aplicação.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginView } from '../pages/Login';
import { HomeAlunoView } from '../pages/home_aluno_view.tsx';
import { HomePersonalView } from '../pages/home_personal_view';
import { ListagemAlunosView } from '../pages/listagem_alunos_view';
import { PerfilAlunoView } from '../pages/perfil_aluno_view';
import { TreinosModeloView } from '../pages/treinos_modelo_view';

/** Função que define as rotas da aplicação.
 *
 * '/login':                          Página de login.
 * '/personal/dashboard':             Dashboard do personal.
 * '/personal/alunos':                Listagem de alunos do personal.
 * '/personal/alunos/:cpf':           Perfil do aluno.
 * '/personal/alunos/:cpf/treinos':   Seleção de treino modelo para associar ao aluno.
 * '*':                               Redireciona para /login em rota desconhecida.
 *
 * @returns Componente Routes contendo as definições das rotas da aplicação
 */
export const AppRoutes = () => {
    return(
        <Routes>
            {<Route path="/login" element={<LoginView />} />}               // Rota que exibe a página de teste de login da aplicação, representada pelo componente Teste
            
            {<Route path="/alunoView" element={<HomeAlunoView />} />}
            {<Route path="/personal/dashboard" element={<HomePersonalView />} />}
            <Route path="*" element={<Navigate to="/login" replace />} />   // Redireciona para a página de login caso a rota não seja encontrada
            <Route path="/login" element={<LoginView />} />
            <Route path="/personal/dashboard" element={<HomePersonalView />} />
            <Route path="/personal/alunos" element={<ListagemAlunosView />} />
            <Route path="/personal/alunos/:cpf" element={<PerfilAlunoView />} />
            <Route path="/personal/alunos/:cpf/treinos" element={<TreinosModeloView />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}
