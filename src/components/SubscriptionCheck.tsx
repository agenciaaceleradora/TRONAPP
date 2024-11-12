import React from 'react';
import { LockKeyhole, AlertCircle, Mail, Check, Star, TrendingUp, Shield } from 'lucide-react';
import { auth } from '../firebaseConfig';

interface SubscriptionCheckProps {
  isActive: boolean;
  children: React.ReactNode;
}

export function SubscriptionCheck({ isActive, children }: SubscriptionCheckProps) {
  const userEmail = auth.currentUser?.email;

  if (!isActive) {
    return (
      <div className="min-h-screen bg-[#010205] flex flex-col items-center justify-center p-4">
        <div className="bg-[#010205] rounded-lg p-8 max-w-4xl w-full text-center border border-purple-500/20">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-500/10 rounded-full">
              <LockKeyhole className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Acesso Bloqueado</h2>
          <p className="text-gray-300 mb-6">
            Para acessar o TRON APP, você precisa ter uma assinatura ativa.
          </p>
          
          {userEmail && (
            <div className="bg-[#010205] rounded-lg p-4 mb-6 border border-purple-500/20">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <Mail className="w-5 h-5" />
                <span>Email cadastrado: <span className="font-medium text-purple-400">{userEmail}</span></span>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Plano Mensal */}
            <div className="relative group transform transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#010205] rounded-xl p-8 border border-purple-500/20 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Plano Mensal</h3>
                    <p className="text-sm text-gray-400 mt-1">Flexibilidade máxima</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-full p-3">
                    <TrendingUp className="w-7 h-7 text-purple-400" />
                  </div>
                </div>
                <div className="mb-8">
                  <div className="text-sm text-purple-400 mb-1">A partir de</div>
                  <span className="text-5xl font-bold text-white">R$ 69</span>
                  <span className="text-lg text-purple-400 ml-2">/mês</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>Acesso completo ao diário</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>Análises detalhadas</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>Calculadora profissional</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <a
                  href="https://go.perfectpay.com.br/PPU38CP7K49"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold px-6 py-4 rounded-lg inline-block transition-all duration-200 w-full text-center transform hover:scale-[1.02] shadow-lg"
                >
                  Começar Agora
                </a>
              </div>
            </div>

            {/* Plano Vitalício */}
            <div className="relative group transform transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gradient-to-b from-[#010205] to-amber-950/20 rounded-xl p-8 border border-amber-500/30 h-full">
                <div className="absolute -top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  MELHOR ESCOLHA
                </div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-amber-500">Plano Vitalício</h3>
                    <p className="text-sm text-amber-300/80 mt-1">Acesso ilimitado</p>
                  </div>
                  <div className="bg-amber-500/10 rounded-full p-3">
                    <Star className="w-7 h-7 text-amber-400" fill="currentColor" />
                  </div>
                </div>
                <div className="mb-8">
                  <div className="text-sm text-amber-400 mb-1">Pagamento único</div>
                  <span className="text-5xl font-bold text-white">R$ 297</span>
                  <span className="text-lg text-amber-400 ml-2">/único</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-amber-100/90">
                    <Shield className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span>Acesso vitalício garantido</span>
                  </li>
                  <li className="flex items-center gap-3 text-amber-100/90">
                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span>Tudo do plano mensal</span>
                  </li>
                  <li className="flex items-center gap-3 text-amber-100/90">
                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span>Sem pagamentos recorrentes</span>
                  </li>
                  <li className="flex items-center gap-3 text-amber-100/90">
                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span>Economia de mais de 70%</span>
                  </li>
                </ul>
                <a
                  href="https://go.perfectpay.com.br/PPU38CP80K7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-6 py-4 rounded-lg inline-block transition-all duration-200 w-full text-center transform hover:scale-[1.02] shadow-lg"
                >
                  Garantir Acesso Vitalício
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#010205] rounded-lg p-6 mb-8 border border-purple-500/20">
            <h4 className="text-lg font-semibold text-white mb-6">Como funciona?</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-b from-[#010205] to-purple-950/20 rounded-lg p-6 border border-purple-500/10">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 text-lg font-bold">
                  1
                </div>
                <p className="text-sm text-gray-300">
                  Faça o pagamento através de um dos planos acima
                </p>
              </div>
              <div className="bg-gradient-to-b from-[#010205] to-purple-950/20 rounded-lg p-6 border border-purple-500/10">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 text-lg font-bold">
                  2
                </div>
                <p className="text-sm text-gray-300">
                  Após a confirmação, você receberá um email para criar sua senha
                </p>
              </div>
              <div className="bg-gradient-to-b from-[#010205] to-purple-950/20 rounded-lg p-6 border border-purple-500/10">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 text-lg font-bold">
                  3
                </div>
                <p className="text-sm text-gray-300">
                  Use seu email e a senha criada para fazer login no sistema
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#010205] rounded-lg p-6 mb-8 border border-amber-500/20">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <AlertCircle className="w-6 h-6" />
              <span className="font-medium text-lg">Importante</span>
            </div>
            <p className="text-gray-300">
              Se você já realizou o pagamento, aguarde alguns minutos para receber o email 
              de confirmação. Caso não receba, entre em contato com o suporte informando 
              seu email.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-purple-400">
              <Shield className="w-4 h-4" />
              <span>Pagamento 100% seguro</span>
            </div>
            <div className="hidden sm:block text-gray-600">•</div>
            <div className="flex items-center gap-2 text-purple-400">
              <Check className="w-4 h-4" />
              <span>Garantia de 7 dias</span>
            </div>
            <div className="hidden sm:block text-gray-600">•</div>
            <div className="flex items-center gap-2 text-purple-400">
              <Mail className="w-4 h-4" />
              <span>Suporte especializado</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}