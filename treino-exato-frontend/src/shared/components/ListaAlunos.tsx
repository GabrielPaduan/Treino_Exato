import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, Search, ArrowLeftRight, User } from 'lucide-react';
import { useAuth } from '../context/auth_context';
import { buscarAlunos} from '../services/dashboardPersonalService';
import { AlunoCard } from './AlunoCard';
import type { Aluno } from '../utils/DTO';

type Status = 'loading' | 'successo' | 'vazio' | 'erro';

export function ListaAlunos() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [status, setStatus] = useState<Status>('loading');

    useEffect(() => {
        buscarAlunos()
            .then((data) => {
                if (data.alunos.length === 0) {
                    setStatus('vazio');
                } else {
                    setAlunos(data.alunos);
                    setStatus('successo');
                }
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    logout();
                    navigate('/login');
                } else {
                    setStatus('erro');
                }
            });
    }, []);

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col">

            <header className="flex items-center justify-between px-6 py-4 bg-zinc-800">
                <Menu className="text-white w-6 h-6" />
                <div className="flex flex-col items-center">
                    <span className="text-white font-bold text-lg">Treino exato</span>
                    <span className="text-zinc-400 text-sm">Lista de alunos</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-zinc-600 flex items-center justify-center">
                    <User className="text-zinc-300 w-5 h-5" />
                </div>
            </header>

            <main className="flex-1 px-6 py-4 overflow-y-auto">

                {status === 'loading' && (
                    <div className="flex justify-center items-center h-full">
                        <div className="w-10 h-10 border-4 border-zinc-500 border-t-white rounded-full animate-spin" />
                    </div>
                )}

                {status === 'successo' && (
                    <div className="flex flex-col gap-3">
                        {alunos.map((aluno) => (
                            <AlunoCard key={aluno.id} aluno={aluno} />
                        ))}
                    </div>
                )}

                {status === 'vazio' && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-zinc-400 text-center">
                            Nenhum aluno vinculado ainda.
                        </p>
                    </div>
                )}

                {status === 'erro' && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-red-400 text-center">
                            Erro ao carregar os alunos. Tente novamente mais tarde.
                        </p>
                    </div>
                )}

            </main>

            <nav className="flex items-center justify-around px-6 py-4 bg-zinc-800">
                <Home className="text-white w-6 h-6" />
                <Search className="text-zinc-500 w-6 h-6" />
                <ArrowLeftRight className="text-zinc-500 w-6 h-6" />
                <User className="text-zinc-500 w-6 h-6" />
            </nav>
        </div>
    );
}