import { LoginForm } from '../shared/components/LoginForm';

export function LoginView() {
  return (
  <div
    style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#191919',
    }}
  >
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
        }}
        >
        <h1
        style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            fontFamily: 'Arial',
            color: 'white',
            }}
        > 
            Treino Exato
        </h1>
        <LoginForm />;
    </div>
  </div>
  );
}