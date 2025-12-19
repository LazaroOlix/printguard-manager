import React, { useState } from 'react';
import { Plus, Search, Printer as PrinterIcon, Hash, Calendar } from 'lucide-react';
import { useData } from '../services/DataContext';
import Modal from '../components/ui/Modal';
import { Printer } from '../types';

const Printers: React.FC = () => {
  const { printers, clients, addPrinter } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Printer>>({
    brand: '',
    model: '',
    serialNumber: '',
    pageCounter: 0,
    clientId: '',
    contractType: 'Avulso',
    lastMaintenanceDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId) return;

    const newPrinter: Printer = {
      id: Date.now().toString(),
      brand: formData.brand!,
      model: formData.model!,
      serialNumber: formData.serialNumber!,
      pageCounter: Number(formData.pageCounter),
      clientId: formData.clientId!,
      contractType: formData.contractType as any,
      lastMaintenanceDate: formData.lastMaintenanceDate!
    };

    addPrinter(newPrinter);
    setIsModalOpen(false);
    setFormData({
      brand: '', model: '', serialNumber: '', pageCounter: 0, clientId: '', contractType: 'Avulso', lastMaintenanceDate: new Date().toISOString().split('T')[0]
    });
  };

  const filteredPrinters = printers.filter(p => 
    p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Cliente Removido';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Impressoras</h1>
          <p className="text-slate-500 text-lg">Parque de máquinas monitorado</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors shadow-sm text-lg font-medium"
        >
          <Plus size={24} />
          Nova Impressora
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por modelo ou serial..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrinters.map((printer) => (
          <div key={printer.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{printer.brand}</span>
              <span className="text-sm text-slate-500 border border-slate-200 px-3 py-1 rounded-full">{printer.contractType}</span>
            </div>
            <h3 className="font-bold text-xl text-slate-800">{printer.model}</h3>
            <p className="text-base text-slate-500 mb-6">{getClientName(printer.clientId)}</p>
            
            <div className="space-y-3 text-base text-slate-600 border-t border-slate-100 pt-4">
               <p className="flex items-center justify-between">
                 <span className="flex items-center gap-2"><Hash size={20} className="text-slate-400" /> Serial:</span>
                 <span className="font-mono">{printer.serialNumber}</span>
               </p>
               <p className="flex items-center justify-between">
                 <span className="flex items-center gap-2"><PrinterIcon size={20} className="text-slate-400" /> Contador:</span>
                 <span>{printer.pageCounter.toLocaleString()} pgs</span>
               </p>
               <p className="flex items-center justify-between">
                 <span className="flex items-center gap-2"><Calendar size={20} className="text-slate-400" /> Últ. Manut.:</span>
                 <span>{printer.lastMaintenanceDate}</span>
               </p>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Impressora">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-medium text-slate-700 mb-2">Cliente Proprietário</label>
            <select 
              required
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
              value={formData.clientId}
              onChange={e => setFormData({...formData, clientId: e.target.value})}
            >
              <option value="">Selecione...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-6">
             <div>
                <label className="block text-base font-medium text-slate-700 mb-2">Marca</label>
                <input 
                  required
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
                  value={formData.brand}
                  onChange={e => setFormData({...formData, brand: e.target.value})}
                  placeholder="Ex: HP"
                />
             </div>
             <div>
                <label className="block text-base font-medium text-slate-700 mb-2">Modelo</label>
                <input 
                  required
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
                  value={formData.model}
                  onChange={e => setFormData({...formData, model: e.target.value})}
                  placeholder="Ex: LaserJet M1132"
                />
             </div>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-700 mb-2">Número de Série</label>
            <input 
              required
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
              value={formData.serialNumber}
              onChange={e => setFormData({...formData, serialNumber: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="block text-base font-medium text-slate-700 mb-2">Contador Inicial</label>
                <input 
                  type="number"
                  required
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
                  value={formData.pageCounter}
                  onChange={e => setFormData({...formData, pageCounter: Number(e.target.value)})}
                />
            </div>
            <div>
                <label className="block text-base font-medium text-slate-700 mb-2">Tipo Contrato</label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
                  value={formData.contractType}
                  onChange={e => setFormData({...formData, contractType: e.target.value as any})}
                >
                    <option value="Avulso">Avulso</option>
                    <option value="Mensal">Mensal</option>
                    <option value="Custo por Página">Custo por Página</option>
                </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl text-base font-medium">Cancelar</button>
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-base font-medium">Salvar Impressora</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Printers;