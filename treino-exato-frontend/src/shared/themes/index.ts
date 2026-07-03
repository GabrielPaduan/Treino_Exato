import { createTheme } from '@mui/material/styles';

// Tema escuro corporativo exigido pela issue ("padrao visual escuro via ThemeProvider").
// background.default (#0f0f0f) ja fica dentro da faixa quase-preta do mockup (~#141414-#181818),
// diferenca imperceptivel — nao alterado.
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: { default: '#0f0f0f', paper: '#1a1a1a' },
        primary: { main: '#7c4dff' },
    },
    shape: { borderRadius: 12 },
});

// Tema claro — mesma cor primaria roxa do dark, backgrounds default do MUI (nao ha hex definido pelo mockup).
export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#7c4dff' },
    },
    shape: { borderRadius: 12 },
});
