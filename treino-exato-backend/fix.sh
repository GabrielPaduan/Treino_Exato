#!/usr/bin/env bash
# ============================================================
# fix_backend_criar_treino.sh
# Idempotente: verifica o backend da task Criar Treino em
# arquitetura de camadas (Routes->Controller->Service->Repository)
# sob "module": "nodenext" (imports relativos exigem .js).
# So (re)escreve o que estiver faltando/divergente. Prova final: tsc --noEmit.
#
# Convencoes de saida:
#   [OK]   componente ja correto
#   [FIX]  componente reescrito/corrigido
#   [ERR]  falha que exige acao humana
# Exit code: 0 se tsc passa, 1 caso contrario.
# ============================================================
set -uo pipefail

ROOT="$HOME/Estudos/Facul/EngenhariaDeSoftware/Treino_Exato/treino-exato-backend"
SRC="$ROOT/src"
ok(){  printf '\033[1;32m[OK]\033[0m  %s\n' "$*"; }
fix(){ printf '\033[1;33m[FIX]\033[0m %s\n' "$*"; }
er(){  printf '\033[1;31m[ERR]\033[0m %s\n' "$*" >&2; }

[ -d "$SRC" ] || { er "backend nao encontrado em $SRC"; exit 1; }

# --- pre-check de dependencias criticas do proprio projeto ---
for dep in config/supabase.ts middleware/auth.middleware.ts; do
    [ -f "$SRC/$dep" ] || { er "dependencia ausente: src/$dep (nao faz parte da task, precisa existir)"; exit 1; }
done

mkdir -p "$SRC/repositories" "$SRC/services" "$SRC/controllers" "$SRC/routes"

# write_if_diff <path> <heredoc-content-via-stdin>
# escreve so se o arquivo nao existir ou o conteudo divergir (evita churn)
write_if_diff(){
    local path="$1"; local tmp; tmp="$(mktemp)"
    cat > "$tmp"
    if [ -f "$path" ] && cmp -s "$tmp" "$path"; then
        ok "${path#$SRC/}"
        rm -f "$tmp"
    else
        mv "$tmp" "$path"
        fix "${path#$SRC/}"
    fi
}

write_if_diff "$SRC/repositories/AlunoRepository.ts" << 'EOF'
import supabase from '../config/supabase.js';

export const AlunoRepository = {
    buscarTodos: async (cpfPersonal: string) => {
        const { data: vinculos, error: erroVinculo } = await supabase
            .from('vinculo_personal_aluno')
            .select('cpf_aluno')
            .eq('cpf_personal', cpfPersonal)
            .eq('status', 1);
        if (erroVinculo) throw erroVinculo;
        if (!vinculos || vinculos.length === 0) return [];

        const cpfs = vinculos.map((v: { cpf_aluno: string }) => v.cpf_aluno);
        const { data, error } = await supabase
            .from('aluno')
            .select('cpf_usuario, descricao_lesao, usuario(cpf, nome, email)')
            .in('cpf_usuario', cpfs);
        if (error) throw error;
        return data;
    },
    buscarPorId: async (cpf: string) => {
        const { data, error } = await supabase
            .from('aluno')
            .select('cpf_usuario, descricao_lesao, usuario(cpf, nome, email)')
            .eq('cpf_usuario', cpf)
            .single();
        if (error) throw error;
        return data;
    },
};
EOF

write_if_diff "$SRC/repositories/TreinoRepository.ts" << 'EOF'
import supabase from '../config/supabase.js';

export const TreinoRepository = {
    buscarTreinosModelo: async (cpfPersonal: string) => {
        const { data, error } = await supabase
            .from('treino')
            .select('id, nome_treino, descricao_treino')
            .eq('cpf_personal', cpfPersonal);
        if (error) throw error;
        return data;
    },
    cadastrarNovoTreino: async (idAluno: string, idTreino: number, cpfPersonal: string, nomeAgenda: string) => {
        const { error } = await supabase
            .from('agenda')
            .insert({ nome_agenda: nomeAgenda, cpf_personal: cpfPersonal, cpf_aluno: idAluno, id_treino: idTreino });
        if (error) throw error;
    },
};
EOF

write_if_diff "$SRC/services/AlunoService.ts" << 'EOF'
import { AlunoRepository } from '../repositories/AlunoRepository.js';

export const AlunoService = {
    listarAlunos: (cpfPersonal: string) => AlunoRepository.buscarTodos(cpfPersonal),
    buscarAlunoPorId: (cpf: string) => AlunoRepository.buscarPorId(cpf),
};
EOF

write_if_diff "$SRC/services/TreinoService.ts" << 'EOF'
import { TreinoRepository } from '../repositories/TreinoRepository.js';

export const TreinoService = {
    listarTreinosModelo: (cpfPersonal: string) => TreinoRepository.buscarTreinosModelo(cpfPersonal),
    associarTreino: (idAluno: string, idTreino: number, cpfPersonal: string, nomeAgenda: string) =>
        TreinoRepository.cadastrarNovoTreino(idAluno, idTreino, cpfPersonal, nomeAgenda),
};
EOF

write_if_diff "$SRC/controllers/treino.controller.ts" << 'EOF'
import type { Request, Response } from 'express';
import { AlunoService } from '../services/AlunoService.js';
import { TreinoService } from '../services/TreinoService.js';

export const listarAlunos = async (req: Request, res: Response) => {
    try {
        const cpfPersonal = req.user?.sub ?? '';
        const alunos = await AlunoService.listarAlunos(cpfPersonal);
        return res.status(200).json(alunos);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar alunos.', error });
    }
};

export const buscarAlunoPorId = async (req: Request, res: Response) => {
    try {
        const cpf = req.params.cpf;
        if (typeof cpf !== 'string') return res.status(400).json({ message: 'CPF invalido.' });
        const aluno = await AlunoService.buscarAlunoPorId(cpf);
        if (!aluno) return res.status(404).json({ message: 'Aluno nao encontrado.' });
        return res.status(200).json(aluno);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar aluno.', error });
    }
};

export const listarTreinosModelo = async (req: Request, res: Response) => {
    try {
        const cpfPersonal = req.user?.sub ?? '';
        const treinos = await TreinoService.listarTreinosModelo(cpfPersonal);
        return res.status(200).json(treinos);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar treinos modelo.', error });
    }
};

export const associarTreino = async (req: Request, res: Response) => {
    try {
        const cpfPersonal = req.user?.sub ?? '';
        const { idAluno, idTreino } = req.body;
        if (!idAluno || !idTreino)
            return res.status(400).json({ message: 'idAluno e idTreino sao obrigatorios.' });
        await TreinoService.associarTreino(idAluno, Number(idTreino), cpfPersonal, 'Treino');
        return res.status(201).json({ message: 'Treino associado com sucesso.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao associar treino.', error });
    }
};
EOF

write_if_diff "$SRC/routes/treino.routes.ts" << 'EOF'
import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js';
import {
    listarAlunos, buscarAlunoPorId, listarTreinosModelo, associarTreino
} from '../controllers/treino.controller.js';

const router = Router();
router.use(verifyToken, authorizeRoles('PERSONAL'));
router.get('/alunos', listarAlunos);
router.get('/alunos/:cpf', buscarAlunoPorId);
router.get('/treinos/modelos', listarTreinosModelo);
router.post('/treinos/associar', associarTreino);
export default router;
EOF

# --- index.ts: garantir import com .js e registro da rota (sem reescrever tudo) ---
IDX="$SRC/index.ts"
if grep -q "treino.routes'" "$IDX" 2>/dev/null; then
    sed -i "s|from './routes/treino.routes'|from './routes/treino.routes.js'|" "$IDX"
    fix "index.ts (extensao .js no import)"
elif grep -q "treino.routes.js'" "$IDX" 2>/dev/null; then
    ok "index.ts (import ja com .js)"
else
    er "index.ts nao importa treino.routes — verifique manualmente"
fi

# --- guard de arquitetura: controller NAO pode falar com supabase direto ---
if grep -q "supabase" "$SRC/controllers/treino.controller.ts"; then
    er "VIOLACAO DE CAMADA: controller referencia supabase (deveria usar Service)"
else
    ok "arquitetura: controller nao acessa supabase direto"
fi

# --- prova final ---
echo "---- tsc --noEmit ----"
cd "$ROOT"
if node_modules/.bin/tsc --noEmit; then
    ok "typecheck limpo"
    echo "BACKEND OK"
    exit 0
else
    er "typecheck falhou (veja acima)"
    exit 1
fi
