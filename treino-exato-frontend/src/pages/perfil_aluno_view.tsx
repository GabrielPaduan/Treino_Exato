import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, Divider, Alert, CircularProgress, Button, Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { dashboardPersonalService, type Aluno } from '../shared/services/dashboardPersonalService';

export const PerfilAlunoView = () => {
    const { cpf } = useParams<{ cpf: string }>();
    const navigate = useNavigate();

    const [aluno, setAluno] = useState<Aluno | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (!cpf) { navigate('/personal/alunos'); return; }
        (async () => {
            setCarregando(true); setErro(null);
            try { setAluno(await dashboardPersonalService.buscarAlunoPorId(cpf)); }
            catch { setErro('Erro ao carregar perfil do aluno.'); }
            finally { setCarregando(false); }
        })();
    }, [cpf, navigate]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3, maxWidth: 600, mx: 'auto' }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/personal/alunos')} variant="outlined" size="small">Voltar</Button>
                <Typography variant="h5" fontWeight={700}>Perfil do Aluno</Typography>
            </Stack>

            {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
            {carregando ? (
                <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
            ) : aluno && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight={700} gutterBottom>{aluno.usuario.nome}</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>{aluno.usuario.email}</Typography>
                        <Divider sx={{ my: 2 }} />
                        {aluno.descricao_lesao && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                <Typography fontWeight={600}>Atenção - Lesão registrada:</Typography>
                                <Typography variant="body2">{aluno.descricao_lesao}</Typography>
                            </Alert>
                        )}
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={() => navigate(`/personal/alunos/${aluno.cpf_usuario}/treinos`)}
                        >
                            CRIAR
                        </Button>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};
