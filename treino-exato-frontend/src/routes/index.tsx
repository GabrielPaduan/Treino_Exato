import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { LoginView } from '../pages/LoginView';

export const AppRoutes = () => {
    return (
        <Routes>
            {<Route path="/login" element={<LoginView />} />}
            <Route path="*" element={<Navigate to="/login" replace />} />    
        </Routes>
    )
}