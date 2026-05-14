import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { LoginView } from '../pages/Login';
import { Teste } from '../pages/TesteLogin';

export const AppRoutes = () => {
    return (
        <Routes>
            {<Route path="/login" element={<LoginView />} />}
            {<Route path="/testeLogin" element={<Teste />} />}
            <Route path="*" element={<Navigate to="/testeLogin" replace />} />    
        </Routes>
        
    )
}