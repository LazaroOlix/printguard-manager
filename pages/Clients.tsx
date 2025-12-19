import React, { useState } from 'react';
import { Plus, Search, Building2, Phone, MapPin, FileText } from 'lucide-react';
import { useData } from '../services/DataContext';
import Modal from '../components/ui/Modal';
import { Client } from '../types';

const Clients: React.FC = () => {
  const { clients, addClient } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    address: '',
    contact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: Date.now().toString(),
      ...formData
    };
    addClient(newClient);
    setIsModalOpen(false);
    setFormData({ name: '', document: '', address: '', contact: '' });
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.document.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Clientes</h1>
          <p className="text-slate-500 text-lg">Gerenciamento da base de clientes</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors shadow-sm text-lg font-medium"
        >
          <Plus size={24} />
          Novo Cliente
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou documento..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Building2 size={32} />
              </div>
            </div>
            <h3 className="font-bold text-xl text-slate-800 mb-2">{client.name}</h3>
            <div className="space-y-3 text-base text-slate-600 mt-6">
               <p className="flex items-center gap-3">
                 <FileText size={20} className="text-slate-400" />
                 {client.document}
               </p>
               <p className="flex items-center gap-3">
                 <Phone size={20} className="text-slate-400" />
                 {client.contact}
               </p>
               <p className="flex items-center gap-3">
                 <MapPin size={20} className="text-slate-400" />
                 <span className="truncate">{client.address}</span>
               </p>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Cliente">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-medium text-slate-700 mb-2">Nome da Empresa / Cliente</label>
            <input 
              required
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-700 mb-2">Documento (CPF/CNPJ)</label>
            <input 
              required
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
              value={formData.document}
              onChange={e => setFormData({...formData, document: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-700 mb-2">Responsável / Contato</label>
            <input 
              required
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
              value={formData.contact}
              onChange={e => setFormData({...formData, contact: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-700 mb-2">Endereço Completo</label>
            <textarea 
              required
              rows={3}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl text-base font-medium">Cancelar</button>
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-base font-medium">Salvar Cliente</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Clients;