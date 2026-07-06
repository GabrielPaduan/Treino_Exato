import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, CardActionArea, Button, Alert, CircularProgress, Chip, Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { dashboardPersonalService, type TreinoModelo } from '../shared/services/dashboardPersonalService';

export const TreinosModeloView = () => {
    const { cpf } = useParams<{ cpf: string }>();
    const navigate = useNavigate();

    const [treinos, setTreinos] = useState<TreinoModelo[]>([]);
    const [treinoSel, setTreinoSel] = useState<TreinoModelo | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const carregarTreinos = useCallback(async () => {
        setCarregando(true); setErro(null);
        try { setTreinos(await dashboardPersonalService.listarTreinosModelo()); }
        catch { setErro('Erro ao carregar treinos modelo.'); }
        finally { setCarregando(false); }
    }, []);

    useEffect(() => {
        if (!cpf) { navigate('/personal/alunos'); return; }
        carregarTreinos();
    }, [cpf, navigate, carregarTreinos]);

    const confirmar = async () => {
        if (!cpf || !treinoSel) return;
        setEnviando(true); setErro(null);
        try {
            await dashboardPersonalService.associarTreino({ idAluno: cpf, idTreino: treinoSel.id });
            navigate('/personal/alunos', { state: { sucesso: 'Treino associado com sucesso!' } });
        } catch {
            setErro('Erro ao cadastrar treino. Tente novamente.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3, maxWidth: 600, mx: 'auto' }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/personal/alunos/${cpf}`)} variant="outlined" size="small">Voltar</Button>
                <Typography variant="h5" fontWeight={700}>Treinos Modelo</Typography>
            </Stack>

            {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
            {carregando ? (
                <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
            ) : treinos.length === 0 ? (
                <>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Nenhum treino modelo disponível. Cadastre um treino antes de continuar.
                    </Alert>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/personal/alunos/${cpf}`)} variant="outlined">
                        Voltar
                    </Button>
                </>
            ) : (
                <>
                    {treinos.map(t => {
                        const sel = treinoSel?.id === t.id;
                        return (
                            <Card key={t.id} sx={{
                                mb: 1.5,
                                border: sel ? '2px solid' : '1px solid',
                                borderColor: sel ? 'primary.main' : 'divider',
                                bgcolor: sel ? 'action.selected' : 'background.paper',
                            }}>
                                <CardActionArea onClick={() => setTreinoSel(t)}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography fontWeight={600}>{t.nome_treino}</Typography>
                                            {sel && <Chip label="Selecionado" color="primary" size="small" />}
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary">{t.descricao_treino}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        );
                    })}
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 2 }}
                        disabled={!treinoSel || enviando}
                        onClick={confirmar}
                    >
                        {enviando ? <CircularProgress size={24} /> : 'CONFIRMAR TREINO'}
                    </Button>
                </>
            )}
        </Box>
    );
};
