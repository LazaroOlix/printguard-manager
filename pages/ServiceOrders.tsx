import React, { useState } from 'react';
import { Plus, Search, Filter, AlertTriangle, Check, Brain, Wrench, Trash2 } from 'lucide-react';
import { useData } from '../services/DataContext';
import { ServiceOrder, OSStatus, Priority } from '../types';
import Modal from '../components/ui/Modal';
import { analyzePrinterProblem } from '../services/geminiService';

const ServiceOrders: React.FC = () => {
  const { orders, clients, printers, technicians, addOrder, deleteOrder, updateOrderStatus } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // New OS Form State
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [description, setDescription] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<{ diagnosis: string; recommendedAction: string; suggestedParts: string[] } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Status Update State
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [newStatus, setNewStatus] = useState<OSStatus>(OSStatus.COMPLETED);

  const handleCreateOS = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: ServiceOrder = {
      id: `OS-2024-${String(orders.length + 1).padStart(3, '0')}`,
      clientId: selectedClient,
      printerId: selectedPrinter,
      status: OSStatus.PENDING,
      priority: Priority.MEDIUM,
      description: description,
      openedAt: new Date().toISOString().split('T')[0],
      partsUsed: [],
      totalValue: 0,
      diagnosis: aiAnalysis?.diagnosis,
      solution: aiAnalysis?.recommendedAction
    };
    addOrder(newOrder);
    setIsModalOpen(false);
    resetForm();
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if(selectedOrder) {
      updateOrderStatus(selectedOrder.id, newStatus, resolutionText);
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
      setResolutionText('');
    }
  };

  // DELETE LOGIC CORRIGIDA
  const handleDeleteOS = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Impede que o clique afete outros elementos
    e.preventDefault();
    
    const confirmed = window.confirm("Tem certeza que deseja EXCLUIR esta Ordem de Serviço? Esta ação não pode ser desfeita.");
    if (confirmed) {
      deleteOrder(id);
    }
  };

  const openStatusModal = (os: ServiceOrder) => {
    setSelectedOrder(os);
    setNewStatus(os.status);
    setResolutionText(os.solution || '');
    setIsStatusModalOpen(true);
  };

  const resetForm = () => {
    setSelectedClient('');
    setSelectedPrinter('');
    setDescription('');
    setAiAnalysis(null);
  };

  const runAiAnalysis = async () => {
    if (!selectedPrinter || !description) return;
    setIsAnalyzing(true);
    const printer = printers.find(p => p.id === selectedPrinter);
    if (printer) {
      const result = await analyzePrinterProblem(printer, description);
      setAiAnalysis(result);
    }
    setIsAnalyzing(false);
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Desconhecido';
  const getPrinterModel = (id: string) => {
    const p = printers.find(p => p.id === id);
    return p ? `${p.brand} ${p.model}` : 'Desconhecido';
  };

  const getStatusColor = (status: OSStatus) => {
    switch (status) {
      case OSStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case OSStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
      case OSStatus.COMPLETED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case OSStatus.WAITING_PARTS: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Ordens de Serviço</h1>
          <p className="text-slate-500 text-lg">Gerencie manutenções e chamados técnicos</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors shadow-sm text-lg font-medium"
        >
          <Plus size={24} />
          Nova Ordem de Serviço
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por cliente, OS ou técnico..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
          <Filter size={20} className="text-slate-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Status</option>
            {Object.values(OSStatus).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* OS List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.map((os) => (
          <div key={os.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow group">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-6">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-mono text-slate-500 text-base">{os.id}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(os.status)}`}>
                    {os.status}
                  </span>
                  {os.priority === Priority.CRITICAL && (
                    <span className="flex items-center gap-1 text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                      <AlertTriangle size={16} /> Crítica
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-xl text-slate-800">{getClientName(os.clientId)}</h3>
                <p className="text-slate-600 text-base flex items-center gap-2 mt-2">
                  <Wrench size={18} />
                  {getPrinterModel(os.printerId)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base text-slate-500">Abertura: {os.openedAt}</p>
                {os.technicianId && (
                  <p className="text-base text-slate-700 font-medium mt-1">
                    Téc: {technicians.find(t => t.id === os.technicianId)?.name}
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6">
              <p className="text-base text-slate-700"><span className="font-bold">Problema:</span> {os.description}</p>
              {os.diagnosis && (
                 <p className="text-base text-slate-600 mt-3 pt-3 border-t border-slate-200">
                   <span className="font-bold text-blue-600 flex items-center gap-2"><Brain size={18}/> Diagnóstico:</span> {os.diagnosis}
                 </p>
              )}
               {os.solution && (
                 <p className="text-base text-slate-600 mt-3 pt-3 border-t border-slate-200">
                   <span className="font-bold text-emerald-600 flex items-center gap-2"><Check size={18}/> Solução:</span> {os.solution}
                 </p>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-4">
               {/* DELETE BUTTON CORRIGIDO */}
               <button 
                 type="button"
                 onClick={(e) => handleDeleteOS(e, os.id)}
                 className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer z-10"
                 title="Excluir Ordem de Serviço"
               >
                 <Trash2 size={20} />
                 <span className="text-sm font-medium">Excluir</span>
               </button>

               <div className="flex gap-3">
                 {os.status !== OSStatus.COMPLETED && os.status !== OSStatus.CANCELED && (
                   <button 
                    type="button"
                    onClick={() => openStatusModal(os)}
                    className="text-base font-medium text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                   >
                     <Check size={20} /> Atualizar Status
                   </button>
                 )}
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* New OS Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Ordem de Serviço">
        <form onSubmit={handleCreateOS} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Cliente</label>
              <select 
                required
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
              >
                <option value="">Selecione um cliente</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Impressora</label>
              <select 
                required
                value={selectedPrinter}
                onChange={(e) => setSelectedPrinter(e.target.value)}
                disabled={!selectedClient}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100 text-base"
              >
                <option value="">Selecione a impressora</option>
                {printers.filter(p => p.clientId === selectedClient).map(p => (
                  <option key={p.id} value={p.id}>{p.brand} {p.model} - {p.serialNumber}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-slate-700 mb-2">Descrição do Problema</label>
            <textarea 
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
              placeholder="Descreva o erro apresentado (ex: manchas na folha, erro 50.4...)"
            />
          </div>

          {/* AI Analysis Section in Modal */}
          {selectedPrinter && description.length > 5 && (
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
               <div className="flex items-center justify-between mb-3">
                 <h4 className="font-bold text-lg text-indigo-900 flex items-center gap-2">
                   <Brain size={20} /> Assistente de Diagnóstico
                 </h4>
                 {!aiAnalysis && (
                   <button 
                    type="button"
                    onClick={runAiAnalysis}
                    disabled={isAnalyzing}
                    className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                   >
                     {isAnalyzing ? 'Analisando...' : 'Analisar com IA'}
                   </button>
                 )}
               </div>
               
               {aiAnalysis && (
                 <div className="space-y-3 text-base text-indigo-800 animate-in fade-in slide-in-from-top-2">
                   <p><strong>Diagnóstico Provável:</strong> {aiAnalysis.diagnosis}</p>
                   <p><strong>Ação Recomendada:</strong> {aiAnalysis.recommendedAction}</p>
                   {aiAnalysis.suggestedParts.length > 0 && (
                     <p><strong>Peças Sugeridas:</strong> {aiAnalysis.suggestedParts.join(', ')}</p>
                   )}
                 </div>
               )}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors text-base font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-base font-medium"
            >
              Criar Ordem de Serviço
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Status Modal */}
      <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title={`Atualizar OS: ${selectedOrder?.id}`}>
          <form onSubmit={handleUpdateStatus} className="space-y-6">
             <div>
               <label className="block text-base font-medium text-slate-700 mb-2">Novo Status</label>
               <select 
                 className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-base"
                 value={newStatus}
                 onChange={(e) => setNewStatus(e.target.value as OSStatus)}
               >
                 {Object.values(OSStatus).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
             </div>
             
             <div>
               <label className="block text-base font-medium text-slate-700 mb-2">Resolução / Observações</label>
               <textarea 
                  rows={5}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-base"
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Descreva o que foi feito..."
               />
             </div>

             <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
              <button type="button" onClick={() => setIsStatusModalOpen(false)} className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl text-base font-medium">Cancelar</button>
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-base font-medium">Salvar Atualização</button>
            </div>
          </form>
      </Modal>
    </div>
  );
};

export default ServiceOrders;