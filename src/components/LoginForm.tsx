import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { TrendingUp, Mail, Lock, LogIn, Check, Star, Shield } from 'lucide-react';
import { User } from '../types';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const authFunction = isSignUp ? createUserWithEmailAndPassword : signInWithEmailAndPassword;
      const userCredential = await authFunction(auth, email, password);
      onLogin({ 
        username: userCredential.user.email || '', 
        isAuthenticated: true 
      });
    } catch (err: any) {
      let errorMessage = 'Ocorreu um erro. Tente novamente.';
      if (err.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está cadastrado.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010205] flex flex-col items-center justify-start px-4 py-6">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-purple-500/10 p-2 rounded-lg">
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">TRON APP</h1>
        <p className="text-sm text-gray-400">Seu diário de trades inteligente</p>
      </div>

      <div className="w-full max-w-md bg-[#010205] rounded-xl shadow-xl p-6 border border-purple-500/20 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 text-center">
          {isSignUp ? 'Criar Conta' : 'Entrar'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#010205] text-white rounded-lg pl-9 pr-3 py-2 text-sm border border-purple-500/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#010205] text-white rounded-lg pl-9 pr-3 py-2 text-sm border border-purple-500/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 text-red-300 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                {isSignUp ? 'Criar Conta' : 'Entrar'}
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
            >
              {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem uma conta? Cadastre-se'}
            </button>
          </div>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Plano Mensal */}
        <div className="relative group transform transition-all duration-300 hover:-translate-y-1">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[#010205] rounded-xl p-6 border border-purple-500/20 h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Plano Mensal</h3>
                <p className="text-xs text-gray-400 mt-1">Flexibilidade máxima</p>
              </div>
              <div className="bg-purple-500/10 rounded-full p-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-purple-400 mb-1">A partir de</div>
              <span className="text-3xl font-bold text-white">R$ 69</span>
              <span className="text-sm text-purple-400 ml-1">/mês</span>
            </div>
            <ul className="space-y-2 mb-4 text-sm">
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Acesso completo ao diário</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Análises detalhadas</span>
              </li>
            </ul>
            <a
              href="https://go.perfectpay.com.br/PPU38CP7K49"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium px-4 py-2 rounded-lg inline-block transition-all duration-200 w-full text-center transform hover:scale-[1.02] text-sm"
            >
              Começar Agora
            </a>
          </div>
        </div>

        {/* Plano Vitalício */}
        <div className="relative group transform transition-all duration-300 hover:-translate-y-1">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-gradient-to-b from-[#010205] to-amber-950/20 rounded-xl p-6 border border-amber-500/30 h-full">
            <div className="absolute -top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              MELHOR ESCOLHA
            </div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-amber-500">Plano Vitalício</h3>
                <p className="text-xs text-amber-300/80 mt-1">Acesso ilimitado</p>
              </div>
              <div className="bg-amber-500/10 rounded-full p-2">
                <Star className="w-5 h-5 text-amber-400" fill="currentColor" />
              </div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-amber-400 mb-1">Pagamento único</div>
              <span className="text-3xl font-bold text-white">R$ 297</span>
              <span className="text-sm text-amber-400 ml-1">/único</span>
            </div>
            <ul className="space-y-2 mb-4 text-sm">
              <li className="flex items-center gap-2 text-amber-100/90">
                <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Acesso vitalício garantido</span>
              </li>
              <li className="flex items-center gap-2 text-amber-100/90">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Economia de mais de 70%</span>
              </li>
            </ul>
            <a
              href="https://go.perfectpay.com.br/PPU38CP80K7"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-medium px-4 py-2 rounded-lg inline-block transition-all duration-200 w-full text-center transform hover:scale-[1.02] text-sm"
            >
              Garantir Acesso Vitalício
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}