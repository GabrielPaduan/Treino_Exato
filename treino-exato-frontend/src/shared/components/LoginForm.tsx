import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/auth_context';
import { loginUser } from '../services/usuarioService';
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
            const { token } = await loginUser(loginData);

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
                    //fontSize: '2rem',
                    fontWeight: 'bold',
                    fontFamily: 'Arial',
                    color: 'white',
                }}>
                    Faça login
                </h2>
            </div>
        <div>
            <input
            id="login"
            type="text"
            placeholder="E-Mail / CPF"
            {...register('login', { required: 'Campo obrigatório' })}
            />
            {errors.login && <span>{errors.login.message}</span>}
        </div>
        <div>
            <input
            id="senha"
            type="password"
            placeholder="Senha"
            {...register('senha', {
                required: 'Campo obrigatório',
                //minLength: { value: 6, message: 'Mínimo 6 caracteres' },
            })}
            />
            {errors.senha && <span>{errors.senha.message}</span>}
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

