import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { LoginView } from '../pages/LoginView';
import { HomePersonalView } from '../pages/HomePersonalView';

export const AppRoutes = () => {
    return (
        <Routes>
            {<Route path="/login" element={<LoginView />} />}
            {<Route path="/personal/dashboard" element={<HomePersonalView />} />}
            <Route path="*" element={<Navigate to="/login" replace />} />    
        </Routes>
    )
}