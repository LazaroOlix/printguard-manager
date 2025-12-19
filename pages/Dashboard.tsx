import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, Clock, DollarSign, TrendingUp, Cpu } from 'lucide-react';
import { useData } from '../services/DataContext';
import { OSStatus } from '../types';
import { generatePreventiveReport } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const { orders, parts, printers } = useData();
  const [preventiveInsight, setPreventiveInsight] = useState<string>("");
  const [loadingAI, setLoadingAI] = useState(false);

  // KPIs using Context Data
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === OSStatus.PENDING || o.status === OSStatus.WAITING_PARTS).length;
  const completedOrders = orders.filter(o => o.status === OSStatus.COMPLETED).length;
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalValue, 0);

  // Chart Data
  const statusData = [
    { name: 'Pendentes', value: orders.filter(o => o.status === OSStatus.PENDING).length },
    { name: 'Em Andamento', value: orders.filter(o => o.status === OSStatus.IN_PROGRESS).length },
    { name: 'Peças', value: orders.filter(o => o.status === OSStatus.WAITING_PARTS).length },
    { name: 'Concluídas', value: orders.filter(o => o.status === OSStatus.COMPLETED).length },
  ];

  const COLORS = ['#F59E0B', '#3B82F6', '#EF4444', '#10B981'];

  const fetchAIInsights = async () => {
    setLoadingAI(true);
    const report = await generatePreventiveReport(printers);
    setPreventiveInsight(report);
    setLoadingAI(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard Geral</h1>
          <p className="text-slate-500 text-lg">Visão geral da operação técnica</p>
        </div>
        <button 
          onClick={fetchAIInsights}
          disabled={loadingAI}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl disabled:opacity-50 transition-colors shadow-sm text-lg"
        >
          <Cpu size={24} />
          {loadingAI ? 'Analisando...' : 'Gerar Análise Preventiva (IA)'}
        </button>
      </div>

      {/* Insight Card */}
      {preventiveInsight && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 flex gap-6 items-start">
          <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
            <TrendingUp size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-indigo-900">Análise de Manutenção Preventiva (Gemini AI)</h3>
            <p className="text-indigo-800 text-base mt-2 whitespace-pre-line leading-relaxed">{preventiveInsight}</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-base font-medium text-slate-500">OS Pendentes</p>
            <h3 className="text-4xl font-bold text-slate-800 mt-2">{pendingOrders}</h3>
          </div>
          <div className="p-4 bg-amber-50 text-amber-500 rounded-xl">
            <Clock size={32} />
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-base font-medium text-slate-500">OS Concluídas</p>
            <h3 className="text-4xl font-bold text-slate-800 mt-2">{completedOrders}</h3>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-500 rounded-xl">
            <CheckCircle size={32} />
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-base font-medium text-slate-500">Faturamento (Mês)</p>
            <h3 className="text-4xl font-bold text-slate-800 mt-2">R$ {totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="p-4 bg-blue-50 text-blue-500 rounded-xl">
            <DollarSign size={32} />
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-base font-medium text-slate-500">Peças em Alerta</p>
            <h3 className="text-4xl font-bold text-slate-800 mt-2">
              {parts.filter(p => p.quantity <= p.minQuantity).length}
            </h3>
          </div>
          <div className="p-4 bg-red-50 text-red-500 rounded-xl">
            <AlertCircle size={32} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Status das Ordens de Serviço</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-6 flex-wrap">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-base text-slate-600">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Atividade Recente</h3>
          <div className="space-y-6">
            {orders.slice(0, 4).map((os) => (
              <div key={os.id} className="flex items-start gap-5 p-4 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-50 last:border-0">
                <div className={`
                  w-3 h-3 mt-2 rounded-full flex-shrink-0
                  ${os.status === OSStatus.COMPLETED ? 'bg-emerald-500' : 
                    os.status === OSStatus.PENDING ? 'bg-amber-500' : 'bg-blue-500'}
                `} />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-lg text-slate-800">{os.id}</p>
                    <span className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">{os.status}</span>
                  </div>
                  <p className="text-base text-slate-600 mt-1 line-clamp-1">{os.description}</p>
                  <p className="text-sm text-slate-400 mt-2">{os.openedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;