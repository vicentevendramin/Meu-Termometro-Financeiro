import type { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">
            Meu Termômetro Financeiro
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Olá, {user.email}!</span>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Sair
          </button>
        </div>
      </nav>
    </header>
  );
}
