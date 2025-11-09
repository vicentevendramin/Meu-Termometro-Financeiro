import { useState, useEffect } from 'react';
import type { User, ActiveView, NewTransactionData } from './types';
import { apiService } from './services/apiService';

// Páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AppLayout from './layout/AppLayout';
import NewTransactionModal from './components/NewTransactionModal';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<'login' | 'register' | 'app'>('login');
  const [isLoading, setIsLoading] = useState(true);

  // Estado da Aplicação (quando logado)
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyForRefresh, setKeyForRefresh] = useState(0); // Truque para forçar reload

  // Verifica o status de autenticação ao carregar
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        const userData = await apiService.checkAuthStatus();
        if (userData) {
          setUser(userData);
          setPage('app'); // Vai para o layout principal
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
  }, []);

  // --- Handlers de Autenticação ---
  const handleLogin = (userData: User) => {
    setUser(userData);
    setPage('app');
    setActiveView('dashboard'); // Define a view padrão
  };

  const handleLogout = async () => {
    await apiService.logout();
    setUser(null);
    setPage('login');
  };

  const handleNavigateAuth = (targetPage: 'login' | 'register') => {
    setPage(targetPage);
  };

  // --- Handlers da Aplicação ---
  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
  };

  // Handlers do Modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Handler para salvar a transação
  const handleAddTransaction = async (data: NewTransactionData) => {
    try {
      await apiService.addTransaction(data);
      handleCloseModal();
      // Força a atualização do Dashboard ou da página de Transações
      setKeyForRefresh((prevKey) => prevKey + 1); 
    } catch (error) {
      console.error("Falha ao adicionar transação", error);
      // Aqui você pode setar um estado de erro no modal
    }
  };


  // --- Renderização ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-xl font-medium">
        Carregando Termômetro Financeiro...
      </div>
    );
  }

  if (page === 'login') {
    return <LoginPage onLogin={handleLogin} onNavigate={handleNavigateAuth} />;
  }

  if (page === 'register') {
    return <RegisterPage onNavigate={handleNavigateAuth} />;
  }

  // Renderiza o layout principal da aplicação (se logado)
  if (page === 'app' && user) {
    return (
      <>
        <AppLayout
          user={user}
          onLogout={handleLogout}
          activeView={activeView}
          onViewChange={handleViewChange}
          onOpenModal={handleOpenModal}
          contentKey={keyForRefresh}
        />
        <NewTransactionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleAddTransaction}
        />
      </>
    );
  }

  // Fallback (se não estiver carregando, não for 'app', mas não tiver usuário)
  return <LoginPage onLogin={handleLogin} onNavigate={handleNavigateAuth} />;
}

export default App;
