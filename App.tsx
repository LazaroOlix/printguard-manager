import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ServiceOrders from './pages/ServiceOrders';
import Inventory from './pages/Inventory';
import Clients from './pages/Clients';
import Printers from './pages/Printers';
import Auth from './pages/Auth';
import { Menu } from 'lucide-react';
import { DataProvider, useData } from './services/DataContext';

const AppContent: React.FC = () => {
  const { user } = useData();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Se não estiver logado, mostra tela de Login/Cadastro
  if (!user) {
    return <Auth />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'orders': return <ServiceOrders />;
      case 'inventory': return <Inventory />;
      case 'clients': return <Clients />;
      case 'printers': return <Printers />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar - Componente Lateral */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50">
        
        {/* Mobile Header - Sticky no topo */}
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg text-slate-800">PrintGuard</span>
          <div className="w-8" /> {/* Spacer para centralizar o título visualmente se necessário */}
        </header>

        {/* Área de Conteúdo Scrollável */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth">
          <div className="w-full max-w-[1600px] mx-auto pb-10">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;