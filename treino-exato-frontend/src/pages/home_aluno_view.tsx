import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/context/auth_context';
import { getDashboardData } from '../shared/services/dashboard_aluno_service';
import type { ExercicioDTO } from '../shared/utils/DTO';

import "bootstrap/dist/css/bootstrap.min.css";

const HomeIcon = () => <i className="bi bi-house"></i>;
const SearchIcon = () => <i className="bi bi-search"></i>;
const SwapIcon = () => <i className="bi bi-arrow-left-right"></i>;
const UserIcon = () => <i className="bi bi-person"></i>;

const ITENS_NAV = [
    { label: 'Início', Icon: HomeIcon, ativo: true },
    { label: 'Buscar', Icon: SearchIcon, ativo: false },
    { label: 'Trocar treino', Icon: SwapIcon, ativo: false },
    { label: 'Perfil', Icon: UserIcon, ativo: false },
];

const DATAS = ['Hoje', '10/11', '11/11', '12/11'];

export function HomeAlunoView() {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();

    const [exercicios, setExercicios] = useState<ExercicioDTO[]>([]);
    const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
    const [dataSelecionada, setDataSelecionada] = useState('Hoje');

    useEffect(() => {
        async function fetchDashboard() {
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const data = await getDashboardData(token);
                if (data.length > 0) {
                    setExercicios(data);
                    setStatus('success');
                } else {
                    setStatus('empty');
                }
            } catch (error: any) {
                if (error.message === '401_UNAUTHORIZED') {
                    logout();
                } else {
                    setStatus('error');
                }
            }
        }

        fetchDashboard();
    }, [token, navigate, logout]);

    if (status === 'loading') {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#121212' }}>
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="text-light min-vh-100 d-flex text-start" style={{ backgroundColor: '#121212' }}>
            
            <Sidebar userName={user?.name ?? 'Aluno'} />

            <div className="flex-grow-1 d-flex flex-column h-100">
                
                <Header />

                <main className="px-4 py-2 flex-grow-1">
                    <div className="row g-4 h-100">
                        
                        <div className="col-lg-3">
                            <AgendaSection 
                                dataSelecionada={dataSelecionada} 
                                onSelectData={setDataSelecionada} 
                            />
                        </div>

                        <div className="col-lg-9">
                            <ExerciciosList status={status} exercicios={exercicios} />
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}

function Sidebar({ userName }: { userName: string }) {
    return (
        <aside className="d-flex flex-column flex-shrink-0 p-4 border-end border-secondary border-opacity-25" style={{ width: '260px', minHeight: '100vh' }}>
            <div className="d-flex align-items-center gap-2 px-2 py-2 mb-4">
                <span className="fw-bold fs-4 text-white">Treino exato</span>
            </div>

            <nav className="d-flex flex-column gap-2">
                {ITENS_NAV.map(({ label, Icon, ativo }) => (
                    <button
                        key={label}
                        className="btn d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-start border-0"
                        style={{
                            backgroundColor: ativo ? '#fff' : 'transparent',
                            color: ativo ? '#000' : 'rgba(255,255,255,0.7)',
                            fontWeight: ativo ? 600 : 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        <Icon />
                        <span>{label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto d-flex align-items-center gap-3 px-2 py-2 border-top border-secondary border-opacity-25 pt-4">
                <div className="rounded-circle flex-shrink-0" style={{ width: '40px', height: '40px', backgroundColor: '#333' }} />
                <div className="small">
                    <div className="fw-semibold text-white">{userName}</div>
                    <div className="text-white-50" style={{ fontSize: '0.75rem', cursor: 'pointer' }}>Ver perfil</div>
                </div>
            </div>
        </aside>
    );
}

function Header() {
    return (
        <header className="d-flex justify-content-between align-items-center px-4 py-4 mb-2">
            <div>
                <h3 className="mb-1 fw-bold text-white">Treino de hoje</h3>
                <p className="mb-0 text-white-50 small">Acompanhe sua rotina de exercícios atualizada em tempo real.</p>
            </div>
            <div className="d-flex align-items-center gap-3">
                <img
                    src='https://via.placeholder.com/40'
                    alt="Perfil"
                    className="rounded-circle object-fit-cover border border-secondary"
                    style={{ width: '42px', height: '42px' }}
                />
            </div>
        </header>
    );
}

function AgendaSection({ dataSelecionada, onSelectData }: { dataSelecionada: string, onSelectData: (d: string) => void }) {
    return (
        <section className="border border-secondary border-opacity-25 rounded-4 p-4 h-100" style={{ backgroundColor: '#1a1a1a' }}>
            <button className="btn btn-light w-100 rounded-pill mb-4 fw-semibold py-2">
                Visualizar agenda completa
            </button>
            <div className="d-flex flex-column gap-2">
                {DATAS.map((data) => {
                    const ativo = data === dataSelecionada;
                    return (
                        <button
                            key={data}
                            onClick={() => onSelectData(data)}
                            className={`btn rounded-pill px-4 py-2 fw-semibold text-start border ${ativo ? 'text-dark bg-white border-white' : 'text-light bg-transparent border-secondary border-opacity-50'}`}
                            style={{ transition: 'all 0.2s' }}
                        >
                            {data}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

function ExerciciosList({ status, exercicios }: { status: string, exercicios: ExercicioDTO[] }) {
    if (status === 'empty') {
        return (
            <div className="text-center text-white-50 p-5 border border-secondary border-opacity-10 rounded-4" style={{ backgroundColor: '#1a1a1a' }}>
                <p className="mb-0 fs-5">Nenhum exercício encontrado para hoje.</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-center text-danger p-5 border border-danger border-opacity-10 rounded-4" style={{ backgroundColor: '#1e1414' }}>
                <p className="mb-0 fs-5">Erro ao carregar lista de exercícios. Tente novamente mais tarde.</p>
            </div>
        );
    }

    return (
        <div className="position-relative">
            <ul className="list-unstyled mb-0 row g-3">
                {exercicios.map((ex) => (
                    <li key={ex.id} className="col-12 col-xl-6">
                        <div 
                            className="d-flex justify-content-between align-items-center p-3 rounded-4 border border-secondary border-opacity-25 h-100"
                            style={{ backgroundColor: '#1e1e1e' }}
                        >
                            <div className="d-flex align-items-center pe-3">
                                <span className="rounded-circle flex-shrink-0 me-3" style={{ width: '10px', height: '10px', backgroundColor: '#0d6efd' }} />
                                <div>
                                    <p className="mb-0 fs-5 fw-semibold text-white">{ex.nome}</p>
                                    <p className="mb-0 text-white-50 small mt-1">
                                        Séries: <span className="text-white fw-medium">{ex.series}</span> × Repetições: <span className="text-white fw-medium">{ex.repeticoes}kg</span>
                                    </p>
                                </div>
                            </div>

                            {ex.videoUrl && (
                                <a
                                    href={ex.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="position-relative flex-shrink-0 rounded-3 overflow-hidden border border-secondary border-opacity-50"
                                    style={{ width: '72px', height: '72px' }}
                                >
                                    <img
                                        src='https://via.placeholder.com/72'
                                        alt={ex.nome}
                                        className="w-100 h-100 object-fit-cover"
                                    />
                                </a>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}