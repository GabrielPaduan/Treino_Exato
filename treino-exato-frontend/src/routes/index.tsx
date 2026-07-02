/** Impotações de tipos e funções necessárias para a definição das rotas da aplicação.
 * 
 * Routes e Route são componentes do React Router que permitem definir as rotas da aplicação.
 * Navigate é um componente do React Router que permite redirecionar o usuário para uma rota específica.
 * LoginView é um componente que representa a página de login da aplicação.
 * Teste é um componente que representa uma página de teste de login da aplicação.
 */
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { LoginView } from '../pages/Login';
import { Teste } from '../pages/TesteLogin';
import { HomeAlunoView } from '../pages/home_aluno_view';

/** Função que define as rotas da aplicação.
 * 
 * Define as rotas disponíveis na aplicação, associando cada rota a um componente específico.
 * '/login':      Rota que exibe a página de login da aplicação, representada pelo componente LoginView.
 * '/testeLogin': Rota que exibe a página de teste de login da aplicação, representada pelo componente Teste.
 * '*':           Rota que redireciona o usuário para a página de login caso ele tente acessar uma rota não definida.
 * 
 * @returns Componente Routes contendo as definições das rotas da aplicação
 */
export const AppRoutes = () => {
    return(
        <Routes>
            {<Route path="/login" element={<LoginView />} />}               // Rota que exibe a página de login da aplicação, representada pelo componente LoginView
            {<Route path="/testeLogin" element={<Teste />} />}              // Rota que exibe a página de teste de login da aplicação, representada pelo componente Teste
            
            {<Route path="/alunoView" element={<HomeAlunoView />} />}
            
            <Route path="*" element={<Navigate to="/login" replace />} />   // Redireciona para a página de login caso a rota não seja encontrada
        </Routes>
    )
}