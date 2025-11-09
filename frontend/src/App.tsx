import React, { useState } from 'react';

import type { User, Page } from './types';

import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  // Estado para controlar a página atual (nosso "roteador" simples)
  const [page, setPage] = useState<Page>('login');
  
  // Estado para controlar o usuário autenticado
  const [user, setUser] = useState<User | null>(null);

  // Função para lidar com a navegação
  const handleNavigate = (targetPage: Page) => {
    setPage(targetPage);
  };

  // Função chamada pela LoginPage quando o login é bem-sucedido
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setPage('dashboard');
  };

  // Função para fazer logout
  const handleLogout = () => {
    setUser(null);
    setPage('login');
  };

  // Função para renderizar a página correta com base no estado
  const renderPage = () => {
    // Se o usuário não estiver logado, force as páginas de login/registro
    if (!user) {
      switch (page) {
        case 'login':
          return <LoginPage onLoginSuccess={handleLogin} onNavigate={handleNavigate} />;
        case 'register':
          return <RegisterPage onNavigate={handleNavigate} />;
        default:
          return <LoginPage onLoginSuccess={handleLogin} onNavigate={handleNavigate} />;
      }
    }

    // Se o usuário ESTIVER logado
    switch (page) {
      case 'dashboard':
        return <DashboardPage user={user} />;
      // Adicionar outras páginas (ex: 'profile', 'settings') aqui
      default:
        return <DashboardPage user={user} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <Header user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
      {/* O conteúdo da página principal é renderizado aqui */}
      {renderPage()}
    </div>
  );
}

export default App;
