import { useState, useEffect } from 'react';
import type { User } from './types';
// Importa o serviço completo
import { apiService } from './services/apiService'; 

// Importa os componentes
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<'login' | 'register' | 'dashboard'>('login');
  const [isLoading, setIsLoading] = useState(true); // Começa carregando

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        const userData = await apiService.checkAuthStatus(); // <--- CHAVE
        if (userData) {
          setUser(userData);
          setPage('dashboard');
        } else {
          setPage('login');
        }
      } catch (error) {
        setPage('login');
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []); // O array vazio [] faz isso rodar 1 vez no início

  // Callback para o LoginPage
  const handleLogin = (userData: User) => {
    setUser(userData);
    setPage('dashboard');
  };

  const handleLogout = async () => {
    await apiService.logout(); // <--- CHAVE
    setUser(null);
    setPage('login');
  };

  // Callback para navegar entre login/registro
  const handleNavigate = (targetPage: 'login' | 'register' | 'dashboard') => {
    setPage(targetPage);
  };

  // Lógica de renderização
  const renderPage = () => {
    switch (page) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      
      case 'dashboard':
        if (!user) {
          // Se tentar acessar o dashboard sem usuário, volta ao login
          return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
        }
        // Se o usuário existe, renderiza o app principal
        return (
          <div className="min-h-screen bg-gray-100">
            <Header user={user} onLogout={handleLogout} />
            <main className="p-4 md:p-8 max-w-7xl mx-auto">
              <DashboardPage user={user} />
            </main>
          </div>
        );
          
      default:
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
    }
  };

  // Tela de loading inicial
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-xl font-medium">
        Carregando Termômetro Financeiro...
      </div>
    );
  }

  // Renderiza a página correta
  return <>{renderPage()}</>;
}

export default App;
