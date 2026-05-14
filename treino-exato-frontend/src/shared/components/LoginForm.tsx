import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/auth_context';
import { enviarLogin } from '../services/usuarioService';
import type { LoginDTO } from '../utils/DTO';

export function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const rotasPorPerfil: Record<string, string> = {
        ALUNO: '/aluno/dashboard',
        PERSONAL: '/personal/dashboard',
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginDTO>();


    async function onSubmit(loginData: LoginDTO) {
        try {
            const { token } = await enviarLogin(loginData);

            await login(token);

            const decoded = jwtDecode<{ role: string }>(token);

            navigate(rotasPorPerfil[decoded.role] ?? '/dashboard');

        } catch (error) {
            console.error('Erro ao fazer login', error);
            alert('Credenciais inválidas.');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
            }}>
                <h2
                style={{
                    fontWeight: 'bold',
                    fontFamily: 'Arial',
                    color: 'white',
                }}>
                    Faça login
                </h2>
            </div>
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '10px',
        }}>
            <input
            id="login"
            type="text"
            placeholder="E-Mail / CPF"
            {...register('login', { required: 'Campo obrigatório' })}
            />
            {errors.login && 
            <span
            style={{
                color: 'white',
                fontSize: '12px',
                minHeight: '16px',
                fontFamily: 'Arial'
                }}>
                    {errors.login.message}
            </span>}
        </div>
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '10px',
        }}>
            <input
            id="senha"
            type="password"
            placeholder="Senha"
            {...register('senha', { required: 'Campo obrigatório' })}
            />
            {errors.senha && 
            <span
            style={{
                color: 'white',
                fontSize: '12px',
                minHeight: '16px',
                fontFamily: 'Arial',
                }}>
                    {errors.senha.message}
            </span>}
        </div>
        <div
            style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
        }}>
            <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
        </div>
        </form>
    );
}

