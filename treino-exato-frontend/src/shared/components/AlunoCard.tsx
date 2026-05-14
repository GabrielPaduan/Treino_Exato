import type { Aluno } from '../utils/DTO';
import { User } from 'lucide-react';

interface AlunoCardProps {
    aluno: Aluno;
}

export function AlunoCard({ aluno }: AlunoCardProps) {
    return (
        <div className="flex items-center gap-4 bg-zinc-800 rounded-xl p-4">
            {aluno.avatarUrl ? (
                <img
                    src={aluno.avatarUrl}
                    alt={aluno.name}
                    className="w-12 h-12 rounded-full object-cover"
                />
            ) : (
                <div className="w-12 h-12 rounded-full bg-zinc-600 flex items-center justify-center">
                    <User className="text-zinc-300 w-6 h-6" />
                </div>
            )}
            <span className="text-white font-semibold uppercase tracking-wide">
                {aluno.name}
            </span>
        </div>
    );
}