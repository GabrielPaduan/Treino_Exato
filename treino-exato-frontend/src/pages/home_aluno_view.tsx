import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/context/auth_context';
import { getDashboardData } from '../shared/services/dashboard_aluno_service';
import type { ExercicioDTO } from '../shared/utils/DTO';

export function HomeAlunoView() {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();
    
    const [exercicios, setExercicios] = useState<ExercicioDTO[]>([]);
    const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');

    useEffect(() => {
        async function fetchDashboard() {
            // Redireciona para /login se não existir token
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Pega a lista de exercicios do supabase
                const data = await getDashboardData(token);
                
                if (data.length > 0) {
                    setExercicios(data);
                    setStatus('success'); // exibeLista(Exercicios[])
                } else {
                    setStatus('empty');
                }
            } catch (error: any) {
                if (error.message === '401_UNAUTHORIZED') {
                    logout(); // Redireciona para login
                } else if (error.message === '404_NOT_FOUND') {
                    setStatus('error');
                } else {
                    setStatus('error');
                }
            }
        }

        fetchDashboard();
    }, [token, navigate, logout]);

    // Texto de carregamento
    if (status === 'loading') return <div className="spinner">Carregando treino...</div>;

    return (
        <div className="dashboard-container">
            <header>
                <h1>Olá, {user?.name || 'Aluno'}!</h1>
                <p>Confira seu treino de hoje:</p>
            </header>

            <main>
                {/* Se o fetch foi um sucesso, imprime a lista de exercicios passados */}
                {status === 'success' && (
                    <div className="exercicios-grid">
                        {exercicios.map(ex => (
                            <div key={ex.id} className="exercicio-card">
                                <h3>{ex.nome}</h3>
                                <p>{ex.series} séries de {ex.repeticoes}</p>
                                {ex.videoUrl && (
                                    <a href={ex.videoUrl} target="_blank" rel="noreferrer">
                                        Ver vídeo referencial
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Se a lista for vazia, imprime: */}
                {status === 'empty' && (
                    <div className="feedback-info">
                        <p>Nenhum exercício encontrado.</p>
                    </div>
                )}

                {/* Se houve algum erro no fetch, imprime: */}
                {status === 'error' && (
                    <div className="feedback-error">
                        <p>Erro ao carregar lista de exercícios.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
