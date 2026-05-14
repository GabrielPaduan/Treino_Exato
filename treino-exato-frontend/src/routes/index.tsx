import { Routes, Route } from 'react-router-dom';
import { CriarTreinoPage } from '../pages/CriarTreino';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/criar-treino" element={<CriarTreinoPage />} />
        </Routes>
    )
}
