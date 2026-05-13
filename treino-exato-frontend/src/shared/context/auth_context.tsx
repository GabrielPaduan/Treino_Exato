import React, { useCallback, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export type UserRole = 'ALUNO' | 'PERSONAL' | 'ADMIN';

interface GymUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;   
}

interface AuthContextType {
    user: GymUser | null;
    isAuthenticated: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = React.useState<GymUser | null>(null);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    const logout = useCallback(() => {
        localStorage.removeItem('@GymApp:token');
        setUser(null);
        navigate('/login');
    }, [navigate]);

    const login = useCallback(async (token: string) => {
        localStorage.setItem('@GymApp:token', token);
        const decoded = jwtDecode<any>(token);

        const userData: GymUser = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role
        };
        
        setUser(userData);
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem('@GymApp:token');
        if (storedToken) {
            try {
                const decoded = jwtDecode<any>(storedToken);
                const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : false;
                if (isExpired) {
                    logout();
                } else {
                    setUser({
                        id: decoded.id,
                        name: decoded.name,
                        email: decoded.email,
                        role: decoded.role as UserRole,
                    });
                };
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, [logout]);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    return context;
}