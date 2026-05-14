import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TreinoService, type Aluno, type TreinoModelo } from '../../shared/services/treino.service';

type Etapa = 'listagem' | 'perfil' | 'modelos';

const s: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        color: '#f0f0f0',
        fontFamily: "'Segoe UI', sans-serif",
        padding: '24px',
        maxWidth: '600px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '28px',
    },
    btnVoltar: {
        background: 'none',
        border: '1px solid #333',
        color: '#aaa',
        borderRadius: '8px',
        padding: '6px 14px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    titulo: {
        fontSize: '22px',
        fontWeight: 700,
        margin: 0,
    },
    card: {
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '16px 20px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        transition: 'border-color 0.2s',
    },
    cardNome: { fontWeight: 600, fontSize: '16px', margin: 0 },
    cardSub: { color: '#888', fontSize: '13px', margin: '4px 0 0' },
    seta: { color: '#555', fontSize: '20px' },
    perfilBox: {
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '20px',
    },
    perfilNome: { fontSize: '20px', fontWeight: 700, margin: '0 0 4px' },
    perfilEmail: { color: '#888', fontSize: '14px', margin: '0 0 16px' },
    labelObs: { color: '#aaa', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '6px' },
    obs: {
        background: '#111',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        color: '#ccc',
        marginBottom: '20px',
    },
    semObs: { color: '#555', fontSize: '13px', marginBottom: '20px' },
    btnCriar: {
        width: '100%',
        padding: '14px',
        background: '#4ade80',
        color: '#0f0f0f',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: 700,
        cursor: 'pointer',
    },
    modeloCard: {
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '16px 20px',
        cursor: 'pointer',
        marginBottom: '12px',
        transition: 'border-color 0.2s, background 0.2s',
    },
    modeloCardSelecionado: {
        background: '#0f1f0f',
        border: '1px solid #4ade80',
        borderRadius: '12px',
        padding: '16px 20px',
        cursor: 'pointer',
        marginBottom: '12px',
    },
    modeloNome: { fontWeight: 600, margin: '0 0 4px', fontSize: '15px' },
    modeloDesc: { color: '#888', fontSize: '13px', margin: 0 },
    btnConfirmar: {
        width: '100%', padding: '14px',
        background: '#4ade80', color: '#0f0f0f',
        border: 'none', borderRadius: '10px',
        fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginTop: '8px',
    },
    btnDesabilitado: {
        width: '100%', padding: '14px',
        background: '#1f1f1f', color: '#444',
        border: 'none', borderRadius: '10px',
        fontSize: '16px', fontWeight: 700, cursor: 'not-allowed', marginTop: '8px',
    },
    erro: {
        background: '#1f0a0a', border: '1px solid #ef4444',
        borderRadius: '8px', padding: '12px 16px',
        color: '#ef4444', fontSize: '14px', marginBottom: '16px',
    },
    sucesso: {
        background: '#0a1f0a', border: '1px solid #4ade80',
        borderRadius: '8px', padding: '12px 16px',
        color: '#4ade80', fontSize: '14px', marginBottom: '16px',
    },
    loading: { textAlign: 'center' as const, color: '#555', padding: '40px 0' },
    vazio: { textAlign: 'center' as const, color: '#555', padding: '40px 0', fontSize: '14px' },
};

export const CriarTreinoPage: React.FC = () => {
    const navigate = useNavigate();

    const [etapa, setEtapa] = useState<Etapa>('listagem');
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
    const [treinosModelo, setTreinosModelo] = useState<TreinoModelo[]>([]);
    const [treinoSelecionado, setTreinoSelecionado] = useState<TreinoModelo | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);

    // ── Etapa 1: carrega alunos vinculados ────────────────────────────────────
    const carregarAlunos = useCallback(async () => {
        setCarregando(true);
        setErro(null);
        try {
            const data = await TreinoService.listarAlunos();
            setAlunos(data);
        } catch {
            setErro('Erro ao carregar alunos. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => { carregarAlunos(); }, [carregarAlunos]);

    // ── Etapa 2: abre perfil ───────────────────────────────────────────────────
    const abrirPerfil = async (cpf: string) => {
        setCarregando(true);
        setErro(null);
        try {
            const aluno = await TreinoService.buscarAlunoPorCpf(cpf);
            setAlunoSelecionado(aluno);
            setEtapa('perfil');
        } catch {
            setErro('Erro ao carregar perfil do aluno.');
        } finally {
            setCarregando(false);
        }
    };

    // ── Etapa 3: carrega treinos modelo ───────────────────────────────────────
    const abrirTreinosModelo = async () => {
        setCarregando(true);
        setErro(null);
        try {
            const data = await TreinoService.listarTreinosModelo();
            setTreinosModelo(data);
            setEtapa('modelos');
        } catch {
            setErro('Erro ao carregar treinos modelo.');
        } finally {
            setCarregando(false);
        }
    };

    // ── Confirmar associação ──────────────────────────────────────────────────
    const confirmarAssociacao = async () => {
        if (!alunoSelecionado || !treinoSelecionado) return;
        setCarregando(true);
        setErro(null);
        try {
            await TreinoService.associarTreino({
                cpfAluno: alunoSelecionado.cpf_usuario,
                idTreino: treinoSelecionado.id,
                nomeAgenda: treinoSelecionado.nome_treino,
            });
            setSucesso('Treino associado com sucesso!');
            setTimeout(() => {
                setEtapa('listagem');
                setAlunoSelecionado(null);
                setTreinoSelecionado(null);
                setSucesso(null);
                carregarAlunos();
            }, 1500);
        } catch {
            setErro('Erro ao cadastrar treino. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    // ── Voltar ────────────────────────────────────────────────────────────────
    const voltar = () => {
        setErro(null);
        if (etapa === 'modelos') { setEtapa('perfil'); setTreinoSelecionado(null); }
        else if (etapa === 'perfil') { setEtapa('listagem'); setAlunoSelecionado(null); }
        else navigate(-1);
    };

    const titulos: Record<Etapa, string> = {
        listagem: 'Lista de Alunos',
        perfil: 'Perfil do Aluno',
        modelos: 'Treinos Modelo',
    };

    return (
        <div style={s.container}>
            <div style={s.header}>
                <button style={s.btnVoltar} onClick={voltar}>← Voltar</button>
                <h1 style={s.titulo}>{titulos[etapa]}</h1>
            </div>

            {/* ── Etapa 1: Listagem ── */}
            {etapa === 'listagem' && (
                <>
                    {erro && <div style={s.erro}>{erro}</div>}
                    {carregando ? (
                        <p style={s.loading}>Carregando alunos...</p>
                    ) : alunos.length === 0 ? (
                        <p style={s.vazio}>Nenhum aluno cadastrado.</p>
                    ) : (
                        alunos.map((aluno) => (
                            <div
                                key={aluno.cpf_usuario}
                                style={s.card}
                                onClick={() => abrirPerfil(aluno.cpf_usuario)}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = '#4ade80')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
                            >
                                <div>
                                    <p style={s.cardNome}>{aluno.usuario.nome}</p>
                                    <p style={s.cardSub}>{aluno.usuario.email}</p>
                                </div>
                                <span style={s.seta}>›</span>
                            </div>
                        ))
                    )}
                </>
            )}

            {/* ── Etapa 2: Perfil ── */}
            {etapa === 'perfil' && alunoSelecionado && (
                <>
                    {erro && <div style={s.erro}>{erro}</div>}
                    <div style={s.perfilBox}>
                        <p style={s.perfilNome}>{alunoSelecionado.usuario.nome}</p>
                        <p style={s.perfilEmail}>{alunoSelecionado.usuario.email}</p>
                        <p style={s.labelObs}>Observações / Lesões</p>
                        {alunoSelecionado.descricao_lesao ? (
                            <div style={s.obs}>{alunoSelecionado.descricao_lesao}</div>
                        ) : (
                            <p style={s.semObs}>Nenhuma observação registrada.</p>
                        )}
                        <button
                            style={s.btnCriar}
                            onClick={abrirTreinosModelo}
                            disabled={carregando}
                        >
                            {carregando ? 'Carregando...' : 'CRIAR TREINO'}
                        </button>
                    </div>
                </>
            )}

            {/* ── Etapa 3: Treinos Modelo ── */}
            {etapa === 'modelos' && (
                <>
                    {sucesso && <div style={s.sucesso}>{sucesso}</div>}
                    {erro && <div style={s.erro}>{erro}</div>}
                    {carregando ? (
                        <p style={s.loading}>Carregando treinos...</p>
                    ) : treinosModelo.length === 0 ? (
                        <p style={s.vazio}>Nenhum treino disponível.</p>
                    ) : (
                        <>
                            {treinosModelo.map((treino) => {
                                const sel = treinoSelecionado?.id === treino.id;
                                return (
                                    <div
                                        key={treino.id}
                                        style={sel ? s.modeloCardSelecionado : s.modeloCard}
                                        onClick={() => setTreinoSelecionado(treino)}
                                        onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = '#4ade80'; }}
                                        onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = '#2a2a2a'; }}
                                    >
                                        <p style={s.modeloNome}>{treino.nome_treino}</p>
                                        <p style={s.modeloDesc}>{treino.descricao_treino}</p>
                                    </div>
                                );
                            })}
                            <button
                                style={treinoSelecionado && !carregando ? s.btnConfirmar : s.btnDesabilitado}
                                onClick={confirmarAssociacao}
                                disabled={!treinoSelecionado || carregando}
                            >
                                {carregando ? 'Salvando...' : 'CONFIRMAR TREINO'}
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default CriarTreinoPage;
