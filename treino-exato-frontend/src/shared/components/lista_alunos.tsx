import { useEffect, useState } from "react";
import {
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Toolbar,
    Typography,
    AppBar
} from "@mui/material";

import {
    Home,
    Search,
    Repeat,
    Person,
    Menu
} from "@mui/icons-material";

import { useNavigate } from 'react-router-dom';
import { carregarAlunos } from '../services/personal_service.ts';
import type { AlunoDTO } from '../utils/DTO.ts';

export function ListaAlunos() {

    const navigate = useNavigate();

    const [alunos, setAlunos] = useState<AlunoDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const buscar = async () => {
            const token = localStorage.getItem('@GymApp:token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const dados = await carregarAlunos();
                setAlunos(dados);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    navigate("/login");
                    return;
                }
                setErro("Erro ao carregar alunos.");
            } finally {
                setLoading(false);
            }
        };
        buscar();
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    bgcolor: "#121212",
                }}
            >
                <CircularProgress />
            </Box>

        );
    }
    return (
        <Box
            sx={{
                bgcolor: "#191919",
                color: "white",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar>
                    <IconButton color="inherit">
                        <Menu />
                    </IconButton>
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1 }}
                    >
                        Treino Exato
                    </Typography>
                    <Avatar />
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    flex: 1,
                    overflow: "auto",
                    px: 2,
                }}
            >
                {erro && (
                    <Typography
                        align="center"
                        sx={{ mt: 5 }}
                    >
                        {erro}
                    </Typography>
                )}
                {!erro && alunos.length === 0 && (
                    <Typography
                        align="center"
                        sx={{ mt: 5 }}
                    >
                        Nenhum aluno vinculado.
                    </Typography>
                )}
                <List>
                    {alunos.map(aluno => (
                        <ListItem
                            key={aluno.id}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    src={aluno.foto}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={aluno.nome}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Paper elevation={5}>
                <BottomNavigation
                    showLabels
                    value={0}
                    sx={{
                        bgcolor: '#191919',
                        '& .MuiBottomNavigationAction-root': {
                            color: '#888',
                        },
                        '& .Mui-selected': {
                            color: '#ffffff !important',
                        },
                    }}
                >
                    <BottomNavigationAction
                        icon={<Home />}
                    />
                    <BottomNavigationAction
                        icon={<Search />}
                    />
                    <BottomNavigationAction
                        icon={<Repeat />}
                    />
                    <BottomNavigationAction
                        icon={<Person />}
                    />
                </BottomNavigation>
            </Paper>
        </Box>
    );
}