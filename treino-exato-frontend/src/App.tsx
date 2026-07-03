import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRoutes } from '../src/routes/index';
import { darkTheme, lightTheme } from './shared/themes';
import { AuthProvider } from '../src/shared/context/auth_context';
import { ThemeModeProvider, useThemeMode } from '../src/shared/context/theme_context';

const ThemedApp = () => {
    const { darkMode } = useThemeMode();
    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <BrowserRouter>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export const App = () => {
    return (
        <ThemeModeProvider>
            <ThemedApp />
        </ThemeModeProvider>
    );
};
