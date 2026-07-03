import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, List, Card, CardContent, CardActionArea,
    Button, Alert, CircularProgress, Chip, Divider, Stack,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    dashboardPersonalService, type Aluno, type TreinoModelo,
} from '../../shared/services/dashboardPersonalService';

type Etapa = 'listagem' | 'perfil' | 'modelos';

export const CriarTreinoPage: React.FC = () => {
    const navigate = useNavigate();
    const [etapa, setEtapa] = useState<Etapa>('listagem');
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [alunoSel, setAlunoSel] = useState<Aluno | null>(null);
    const [treinos, setTreinos] = useState<TreinoModelo[]>([]);
    const [treinoSel, setTreinoSel] = useState<TreinoModelo | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);

    const carregarAlunos = useCallback(async () => {
        setCarregando(true); setErro(null);
        try { setAlunos(await dashboardPersonalService.listarAlunos()); }
        catch { setErro('Erro ao carregar alunos. Tente novamente.'); }
        finally { setCarregando(false); }
    }, []);
    useEffect(() => { carregarAlunos(); }, [carregarAlunos]);

    const abrirPerfil = async (cpf: string) => {
        setCarregando(true); setErro(null);
        try { setAlunoSel(await dashboardPersonalService.buscarAlunoPorId(cpf)); setEtapa('perfil'); }
        catch { setErro('Erro ao carregar perfil do aluno.'); }
        finally { setCarregando(false); }
    };
    const abrirTreinos = async () => {
        setCarregando(true); setErro(null);
        try { setTreinos(await dashboardPersonalService.listarTreinosModelo()); setEtapa('modelos'); }
        catch { setErro('Erro ao carregar treinos modelo.'); }
        finally { setCarregando(false); }
    };
    const confirmar = async () => {
        if (!alunoSel || !treinoSel) return;
        setCarregando(true); setErro(null);
        try {
            await dashboardPersonalService.associarTreino({ idAluno: alunoSel.cpf_usuario, idTreino: treinoSel.id });
            setSucesso('Treino associado com sucesso!');
            setTimeout(() => {
                setEtapa('listagem'); setAlunoSel(null); setTreinoSel(null); setSucesso(null); carregarAlunos();
            }, 1500);
        } catch { setErro('Erro ao cadastrar treino. Tente novamente.'); }
        finally { setCarregando(false); }
    };
    const voltar = () => {
        setErro(null);
        if (etapa === 'modelos') { setEtapa('perfil'); setTreinoSel(null); }
        else if (etapa === 'perfil') { setEtapa('listagem'); setAlunoSel(null); }
        else navigate(-1);
    };

    const titulos: Record<Etapa, string> = {
        listagem: 'Lista de Alunos', perfil: 'Perfil do Aluno', modelos: 'Treinos Modelo',
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3, maxWidth: 600, mx: 'auto' }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Button startIcon={<ArrowBackIcon />} onClick={voltar} variant="outlined" size="small">Voltar</Button>
                <Typography variant="h5" fontWeight={700}>{titulos[etapa]}</Typography>
            </Stack>

            {etapa === 'listagem' && (
                <>
                    {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
                    {carregando ? <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
                        : alunos.length === 0 ? <Alert severity="info">Nenhum aluno cadastrado</Alert>
                        : <List disablePadding>{alunos.map(a => (
                            <Card key={a.cpf_usuario} sx={{ mb: 1.5 }}>
                                <CardActionArea onClick={() => abrirPerfil(a.cpf_usuario)}>
                                    <CardContent>
                                        <Typography fontWeight={600}>{a.usuario.nome}</Typography>
                                        <Typography variant="body2" color="text.secondary">{a.usuario.email}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>))}</List>}
                </>
            )}

            {etapa === 'perfil' && alunoSel && (
                <>
                    {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
                    <Card sx={{ mb: 3 }}><CardContent>
                        <Typography variant="h6" fontWeight={700} gutterBottom>{alunoSel.usuario.nome}</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>{alunoSel.usuario.email}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>HISTORICO DE LESOES</Typography>
                        {alunoSel.descricao_lesao
                            ? <Alert severity="warning"  sx={{ mb: 2 }}>
                                <Typography fontWeight={600}>Atencao - Lesao registrada:</Typography>
                                <Typography variant="body2">{alunoSel.descricao_lesao}</Typography>
                              </Alert>
                            : <Alert severity="success" sx={{ mb: 2 }}>Nenhuma lesao registrada.</Alert>}
                        <Button fullWidth variant="contained" size="large" onClick={abrirTreinos} disabled={carregando}>
                            {carregando ? <CircularProgress size={24} /> : 'CRIAR TREINO'}
                        </Button>
                    </CardContent></Card>
                </>
            )}

            {etapa === 'modelos' && (
                <>
                    {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}
                    {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
                    {carregando ? <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
                        : treinos.length === 0
                            ? <Alert severity="warning">Nenhum treino modelo disponivel. Cadastre um treino antes de continuar.</Alert>
                            : <>
                                {treinos.map(t => {
                                    const sel = treinoSel?.id === t.id;
                                    return (
                                        <Card key={t.id} sx={{ mb: 1.5, border: sel ? '2px solid' : '1px solid',
                                            borderColor: sel ? 'primary.main' : 'divider',
                                            bgcolor: sel ? 'action.selected' : 'background.paper' }}>
                                            <CardActionArea onClick={() => setTreinoSel(t)}>
                                                <CardContent>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography fontWeight={600}>{t.nome_treino}</Typography>
                                                        {sel && <Chip label="Selecionado" color="primary" size="small" />}
                                                    </Stack>
                                                    <Typography variant="body2" color="text.secondary">{t.descricao_treino}</Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>);
                                })}
                                <Button fullWidth variant="contained" size="large" onClick={confirmar}
                                    disabled={!treinoSel || carregando} sx={{ mt: 2 }}>
                                    {carregando ? <CircularProgress size={24} /> : 'CONFIRMAR TREINO'}
                                </Button>
                              </>}
                </>
            )}
        </Box>
    );
};

export default CriarTreinoPage;
