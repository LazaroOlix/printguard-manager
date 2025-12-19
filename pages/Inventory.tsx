import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search } from 'lucide-react';
import { useData } from '../services/DataContext';
import Modal from '../components/ui/Modal';
import { Part } from '../types';

const Inventory: React.FC = () => {
  const { parts, addPart, updatePartQuantity } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Part Form
  const [formData, setFormData] = useState<Partial<Part>>({
    name: '', sku: '', quantity: 0, minQuantity: 5, cost: 0, price: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPart: Part = {
      id: Date.now().toString(),
      name: formData.name!,
      sku: formData.sku!,
      quantity: Number(formData.quantity),
      minQuantity: Number(formData.minQuantity),
      cost: Number(formData.cost),
      price: Number(formData.price)
    };
    addPart(newPart);
    setIsModalOpen(false);
    setFormData({ name: '', sku: '', quantity: 0, minQuantity: 5, cost: 0, price: 0 });
  };

  const filteredParts = parts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Estoque de Peças</h1>
          <p className="text-slate-500 text-lg">Controle de peças de reposição e suprimentos</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors shadow-sm text-lg font-medium"
        >
          <Plus size={24} />
          Nova Peça
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 md:col-span-3 lg:col-span-1">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Resumo do Estoque</h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
               <span className="text-slate-600 text-base">Total de Itens</span>
               <span className="font-bold text-xl text-slate-800">{parts.length}</span>
             </div>
             <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl text-red-700 border border-red-100">
               <span className="flex items-center gap-3 text-base font-medium"><AlertTriangle size={20}/> Itens Críticos</span>
               <span className="font-bold text-xl">{parts.filter(p => p.quantity <= p.minQuantity).length}</span>
             </div>
             <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl text-green-700 border border-green-100">
               <span className="text-base font-medium">Valor em Estoque</span>
               <span className="font-bold text-xl">R$ {parts.reduce((acc, curr) => acc + (curr.cost * curr.quantity), 0).toFixed(2)}</span>
             </div>
          </div>
        </div>

        {/* Parts Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 md:col-span-3 lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-4">
             <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
               <input 
                 type="text" 
                 placeholder="Buscar peça por nome ou SKU..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-12 pr-4 py-3 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead className="bg-slate-50 text-slate-600 font-semibold">
                <tr>
                  <th className="p-6">Nome / SKU</th>
                  <th className="p-6">Qtd.</th>
                  <th className="p-6">Custo Unit.</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParts.map((part) => (
                  <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-6">
                      <p className="font-bold text-slate-800 text-lg">{part.name}</p>
                      <p className="text-sm text-slate-500">{part.sku}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <button 
                          className="w-8 h-8 bg-slate-200 hover:bg-slate-300 rounded-lg flex items-center justify-center text-slate-700 font-bold"
                          onClick={() => updatePartQuantity(part.id, Math.max(0, part.quantity - 1))}
                        >
                          -
                        </button>
                        <span className={`font-bold text-lg w-8 text-center ${part.quantity <= part.minQuantity ? 'text-red-600' : 'text-slate-700'}`}>
                          {part.quantity}
                        </span>
                        <button 
                          className="w-8 h-8 bg-slate-200 hover:bg-slate-300 rounded-lg flex items-center justify-center text-slate-700 font-bold"
                          onClick={() => updatePartQuantity(part.id, part.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-6 text-slate-700 font-medium">R$ {part.cost.toFixed(2)}</td>
                    <td className="p-6">
                      {part.quantity === 0 ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                          Esgotado
                        </span>
                      ) : part.quantity <= part.minQuantity ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700">
                          Baixo Estoque
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-bold text-sm">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Nova Peça">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Nome da Peça</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl text-base" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Código SKU</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl text-base" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Quantidade Inicial</label>
              <input required type="number" className="w-full p-3 border border-slate-300 rounded-xl text-base" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Estoque Mínimo</label>
              <input required type="number" className="w-full p-3 border border-slate-300 rounded-xl text-base" value={formData.minQuantity} onChange={e => setFormData({...formData, minQuantity: Number(e.target.value)})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Custo (R$)</label>
              <input required type="number" step="0.01" className="w-full p-3 border border-slate-300 rounded-xl text-base" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Preço Venda (R$)</label>
              <input required type="number" step="0.01" className="w-full p-3 border border-slate-300 rounded-xl text-base" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl text-base font-medium">Cancelar</button>
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-base font-medium">Adicionar ao Estoque</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;