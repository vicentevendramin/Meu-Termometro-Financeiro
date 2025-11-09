import React from 'react';
import type { User, Page } from '../types';

/**
 * Props para o componente Header
 */
interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => onNavigate(user ? 'dashboard' : 'login')}
        >
          🌡️ Meu Termômetro Financeiro
        </div>
        <nav>
          {user ? (
            // Usuário está logado
            <div className="flex items-center gap-4">
              <span className="text-gray-700 hidden sm:inline">Olá, {user.email}</span>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Sair (Logout)
              </button>
            </div>
          ) : (
            // Usuário está deslogado
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('login')}
                className="text-blue-600 font-medium hover:underline"
              >
                Entrar
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Criar Conta
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
