// Importa o componente LoginForm, que é responsável por renderizar o formulário de login da aplicação
import { LoginForm } from '../shared/components/LoginForm';

/** Função que representa a página de login da aplicação.
 * 
 * Renderiza a página de login, que inclui o título da aplicação e o formulário de login.
 * A página é estilizada para centralizar o conteúdo vertical e horizontalmente na tela,
 * e utiliza cores e fontes específicas para criar uma aparência agradável.
 * 
 * @returns Componente JSX representando a página de login da aplicação
 */
export function LoginView(){
    return(
        <div 
        // 1: Define um contêiner principal para a página de login, 
        // com estilo para centralizar o conteúdo e definir a altura mínima da tela
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#191919',
            }}
        >

        <div 
        // 2: Define um contêiner interno para o conteúdo da página de login,
        // com estilo para organizar os elementos em coluna, centralizar e definir espaçamento entre eles
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
            }}
        >

        <h1
        // 3: Define o título da aplicação, com estilo para definir tamanho, peso, fonte e cor do texto
            style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                fontFamily: 'Arial',
                color: 'white',
                }}
        > 
            Treino Exato
        </h1>

        <LoginForm 
        // 4: Renderiza o componente LoginForm, que é responsável por exibir o formulário de login da aplicação
        />

        </div>
        </div>
    );
}