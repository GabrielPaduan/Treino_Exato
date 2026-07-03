import React, { useCallback, useContext, useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'themeMode';

interface ThemeModeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const ThemeModeContext = React.createContext<ThemeModeContextType | undefined>(undefined);

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return stored ? stored === 'dark' : true;
    });

    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const toggleDarkMode = useCallback(() => {
        setDarkMode(prev => !prev);
    }, []);

    return (
        <ThemeModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeModeContext.Provider>
    );
};

export const useThemeMode = () => {
    const context = useContext(ThemeModeContext);
    if (!context) throw new Error("useThemeMode deve ser usado dentro de um ThemeModeProvider");
    return context;
};
