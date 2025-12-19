import React, { useState } from 'react';
import { useData } from '../services/DataContext';
import { Printer, User, Lock, Mail, ArrowRight, UserPlus } from 'lucide-react';

const Auth: React.FC = () => {
  const { login, register } = useData();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = login(email, password);
      if (!success) {
        setError('E-mail ou senha inválidos. (Tente admin@printguard.com / 123)');
      }
    } else {
      if (!name || !email || !password) {
        setError('Preencha todos os campos.');
        return;
      }
      const success = register(name, email, password);
      if (!success) {
        setError('E-mail já cadastrado.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col md:flex-row">
        
        {/* Form Container */}
        <div className="w-full p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Printer size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">PrintGuard</h1>
          </div>

          <h2 className="text-xl font-bold text-slate-700 mb-2 text-center">
            {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
          </h2>
          <p className="text-slate-500 text-center mb-8">
            {isLogin ? 'Gerencie suas ordens de serviço' : 'Comece a usar o sistema agora'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                placeholder="E-mail corporativo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              {isLogin ? 'Entrar no Sistema' : 'Criar Conta'}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-slate-600 hover:text-blue-600 font-medium text-sm flex items-center justify-center gap-2 mx-auto"
            >
              {isLogin ? (
                <>Não tem conta? <span className="text-blue-600">Cadastre-se</span></>
              ) : (
                <>Já tem conta? <span className="text-blue-600">Fazer Login</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;