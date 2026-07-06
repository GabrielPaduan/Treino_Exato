import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar, Avatar, Box, Typography, List, Card, CardContent, CardActionArea,
    Alert, CircularProgress, IconButton, Snackbar, Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { dashboardPersonalService, type Aluno } from '../shared/services/dashboardPersonalService';
import { AppDrawer } from '../shared/components/app_drawer';
import { useThemeMode } from '../shared/context/theme_context';

const iniciais = (nome: string) =>
    nome.trim().split(/\s+/).slice(0, 2).map(parte => parte[0]?.toUpperCase()).join('');

export const ListagemAlunosView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode, toggleDarkMode } = useThemeMode();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(
        (location.state as { sucesso?: string } | null)?.sucesso ?? null
    );

    const carregarAlunos = useCallback(async () => {
        const token = localStorage.getItem('@GymApp:token');
        if (!token) {
            navigate('/login');
            return;
        }
        setCarregando(true); setErro(null);
        try { setAlunos(await dashboardPersonalService.listarAlunos()); }
        catch { setErro('Erro ao carregar alunos. Tente novamente.'); }
        finally { setCarregando(false); }
    }, []);

    useEffect(() => { carregarAlunos(); }, [carregarAlunos]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        aria-label="abrir menu"
                        onClick={() => setDrawerOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', maxWidth: 600, width: '100%', mx: 'auto', p: 3 }}>
                <Typography variant="h5" fontWeight={700} mb={3}>Lista de Alunos</Typography>

                {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
                {carregando ? (
                    <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
                ) : !erro && alunos.length === 0 ? (
                    <Alert severity="info">Nenhum aluno cadastrado</Alert>
                ) : (
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            pr: 0.5,
                            // Scrollbar customizada (roxo claro sobre track escuro). Funciona apenas em
                            // navegadores WebKit/Blink (Chrome, Edge, Safari) — Firefox ignora essas
                            // propriedades e usa a scrollbar nativa. Limitação conhecida, não é bug.
                            '&::-webkit-scrollbar': { width: 8 },
                            '&::-webkit-scrollbar-track': { bgcolor: 'background.paper', borderRadius: 4 },
                            '&::-webkit-scrollbar-thumb': { bgcolor: 'primary.light', borderRadius: 4 },
                        }}
                    >
                        <List disablePadding>
                            {alunos.map(a => (
                                <Card key={a.cpf_usuario} sx={{ mb: 1.5 }}>
                                    <CardActionArea onClick={() => navigate(`/personal/alunos/${a.cpf_usuario}`)}>
                                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar>{iniciais(a.usuario.nome)}</Avatar>
                                            <Box>
                                                <Typography fontWeight={600}>{a.usuario.nome}</Typography>
                                                <Typography variant="body2" color="text.secondary">{a.usuario.email}</Typography>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            ))}
                        </List>
                    </Box>
                )}
            </Box>

            <AppDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                darkMode={darkMode}
                onToggleDarkMode={toggleDarkMode}
            />

            <Snackbar
                open={!!sucesso}
                autoHideDuration={3000}
                onClose={() => setSucesso(null)}
                message={sucesso ?? ''}
            />
        </Box>
    );
};
