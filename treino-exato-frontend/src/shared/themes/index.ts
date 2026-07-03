import { createTheme } from '@mui/material/styles';

// Tema escuro corporativo exigido pela issue ("padrao visual escuro via ThemeProvider").
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: { default: '#0f0f0f', paper: '#1a1a1a' },
        primary: { main: '#4ade80' },
    },
    shape: { borderRadius: 12 },
});
