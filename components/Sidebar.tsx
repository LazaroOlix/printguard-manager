import React from 'react';
import { LayoutDashboard, Wrench, Users, Printer, Package, X, LogOut } from 'lucide-react';
import { useData } from '../services/DataContext';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, toggleSidebar }) => {
  const { user, logout } = useData(); // Consume user data and logout function

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={24} /> },
    { id: 'orders', label: 'Ordens de Serviço', icon: <Wrench size={24} /> },
    { id: 'clients', label: 'Clientes', icon: <Users size={24} /> },
    { id: 'printers', label: 'Impressoras', icon: <Printer size={24} /> },
    { id: 'inventory', label: 'Estoque de Peças', icon: <Package size={24} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop (Overlay Escuro) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 
          w-72 bg-slate-900 text-white 
          flex flex-col h-full shadow-2xl
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:shadow-none md:shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header da Sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 font-bold text-2xl tracking-tight text-white">
            <Printer className="text-blue-500" size={32} />
            <span>PrintGuard</span>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navegação (Scrollável se necessário) */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={`
                group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200
                whitespace-nowrap overflow-hidden
                ${currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <span className={`${currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="font-medium text-base truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer do Usuário - Com Logout */}
        <div className="p-6 border-t border-slate-800 bg-slate-900 shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm ring-2 ring-slate-700 shrink-0">
              {user?.initials || 'US'}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'user@email.com'}</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-all text-sm font-medium"
          >
            <LogOut size={16} />
            Sair da Conta
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
