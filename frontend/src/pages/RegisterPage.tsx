interface RegisterPageProps {
  onNavigate: (targetPage: "login" | "register") => void;
}

const RegisterPage = ({ onNavigate }: RegisterPageProps) => {
  // Lógica de registro (similar ao login)
  // Por enquanto, é apenas um placeholder
  
  return (
    <div className="flex-grow flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Criar Conta</h2>
        <p className="text-center text-gray-700 mb-6">
          (Formulário de registro apareceria aqui)
        </p>
        <p className="text-center text-gray-600 mt-6">
          Já tem uma conta?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-blue-600 font-medium hover:underline"
          >
            Faça Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
