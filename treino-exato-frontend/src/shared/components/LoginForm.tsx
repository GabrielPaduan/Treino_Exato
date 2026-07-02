/** Importações de tipos e funções necessárias para o funcionamento do formulário de login.
 * 
 * useNavigate é um hook do React Router que permite navegar programaticamente entre rotas.
 * useForm é um hook do React Hook Form que facilita a criação e validação de formulários.
 * jwtDecode é uma função que decodifica tokens JWT (JSON Web Tokens), permitindo acessar as informações contidas no token.
 * useAuth é um hook personalizado que fornece acesso ao contexto de autenticação da aplicação.
 * loginUser é uma função do serviço de usuário que realiza a requisição de login para o backend.
 * LoginDTO é uma interface que define a estrutura dos dados de login recebidos na requisição.
 */
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/auth_context';
import { loginUser } from '../services/usuarioService';
import type { LoginDTO } from '../utils/DTO';

/** Função que representa o formulário de login da aplicação.
 * 
 * O formulário permite que o usuário insira suas credenciais (login e senha) e faça login na aplicação.
 * Ele utiliza o React Hook Form para gerenciar o estado do formulário e validar os campos.
 * Ao enviar o formulário, a função onSubmit é chamada, que realiza a requisição de login para o backend.
 * 
 * @returns Componente JSX representando o formulário de login da aplicação
 */
export function LoginForm(){
    // 1: Obtém a função login do contexto de autenticação 
    // e a função navigate do React Router para navegação programática
    const { login } = useAuth();

    // 2: Obtém a função navigate do React Router para navegação programática entre rotas
    const navigate = useNavigate();

    // 3: Define um objeto que mapeia os papéis (roles) dos usuários para as rotas correspondentes na aplicação
    const rotasPorPerfil: Record<string, string> = {
        ALUNO: '/alunoView',       // Adicione a rota correta para o aluno quando estiver disponível
        PERSONAL: '/testeLogin',    // Adicione a rota correta para o personal trainer quando estiver disponível
    };

    /** 4: Obtém as funções do React Hook Form para gerenciar o estado do formulário e validar os campos
     * 
     * register:     Função que registra os campos do formulário para validação e gerenciamento de estado
     * handleSubmit: Função que lida com o envio do formulário e chama a função onSubmit
     * formState:    Objeto que contém informações sobre o estado do formulário, incluindo erros e status de envio
     * - errors:       Objeto que contém os erros de validação dos campos do formulário;
     * - isSubmitting: Boolean que indica se o formulário está sendo enviado;
     * useForm:      Hook do React Hook Form que facilita a criação e validação de formulários
     * 
     * O tipo LoginDTO é usado para tipar os dados do formulário,
     * garantindo que os campos de login e senha estejam presentes e sejam do tipo string.
     */ 
    const{
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginDTO>();

    // 5: Define a função onSubmit que é chamada quando o formulário é enviado.
    async function onSubmit(loginData: LoginDTO){
        // 5.1: Tenta fazer login chamando a função loginUser com os dados do formulário
        try{
            // 5.1.1: Chama a função loginUser passando os dados de login e senha,
            // que retorna um token JWT se a autenticação for bem-sucedida
            const { token } = await loginUser(loginData);

            // 5.1.2: Chama a função login do contexto de autenticação passando o token JWT,
            // que armazena o token e atualiza o estado de autenticação da aplicação
            await login(token);

            // 5.1.3: Decodifica o token JWT para obter o papel (role) do usuário e navega para a rota correspondente
            const decoded = jwtDecode<{ role: string }>(token);
            const perfil = decoded.role;

            const rotaDestino = rotasPorPerfil[perfil] || '/login';

            // 5.1.4: Navega para a rota correspondente ao papel (role) do usuário,
            // ou para a rota padrão '/login' caso o papel não esteja definido no mapeamento
            navigate(rotasPorPerfil[decoded.role] ?? '/login');

        }
        // 5.2: Se ocorrer algum erro durante o login, 
        // exibe uma mensagem de erro no console e um alerta para o usuário
        catch(error){
            console.error('Erro ao fazer login', error);
            alert('Credenciais inválidas.');
        }
    }

    // 6: Retorna o JSX do formulário de login, incluindo os campos de login e senha,
    // botões de envio e mensagens de erro de validação, estilizados com CSS inline
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

