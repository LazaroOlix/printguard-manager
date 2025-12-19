import { Client, Printer, Part, ServiceOrder, Technician, OSStatus, Priority } from '../types';

export const mockClients: Client[] = [
  { id: '1', name: 'Escritório Silva & Associados', document: '12.345.678/0001-90', address: 'Av. Paulista, 1000', contact: 'Roberto' },
  { id: '2', name: 'Hospital Central', document: '98.765.432/0001-10', address: 'Rua da Saúde, 500', contact: 'Dra. Ana' },
  { id: '3', name: 'Tech Solutions Ltda', document: '11.222.333/0001-44', address: 'Rua Inovação, 202', contact: 'Carlos' },
];

export const mockPrinters: Printer[] = [
  { id: '1', clientId: '1', brand: 'HP', model: 'LaserJet Pro M404', serialNumber: 'VNC34221', pageCounter: 45000, lastMaintenanceDate: '2023-10-15', contractType: 'Mensal' },
  { id: '2', clientId: '2', brand: 'Brother', model: 'DCP-L2540', serialNumber: 'BR998877', pageCounter: 125000, lastMaintenanceDate: '2023-11-20', contractType: 'Custo por Página' },
  { id: '3', clientId: '1', brand: 'Epson', model: 'EcoTank L3150', serialNumber: 'X5T9921', pageCounter: 12000, lastMaintenanceDate: '2024-01-10', contractType: 'Avulso' },
  { id: '4', clientId: '3', brand: 'Ricoh', model: 'MP 3055', serialNumber: 'RC554433', pageCounter: 250000, lastMaintenanceDate: '2023-12-05', contractType: 'Mensal' },
];

export const mockParts: Part[] = [
  { id: '1', name: 'Fusor HP M404', sku: 'RM2-2233', quantity: 2, minQuantity: 3, cost: 450, price: 850 },
  { id: '2', name: 'Kit Roletes Brother', sku: 'LY2211', quantity: 15, minQuantity: 5, cost: 45, price: 120 },
  { id: '3', name: 'Toner Preto Genérico', sku: 'TN-GEN-01', quantity: 50, minQuantity: 10, cost: 35, price: 90 },
  { id: '4', name: 'Placa Lógica Epson', sku: 'EP-MB-33', quantity: 0, minQuantity: 2, cost: 300, price: 600 },
];

export const mockTechnicians: Technician[] = [
  { id: '1', name: 'João Técnico', specialty: 'Laser e Grandes Formatos', active: true },
  { id: '2', name: 'Maria Manutenção', specialty: 'Jato de Tinta e Scanners', active: true },
];

export const mockOrders: ServiceOrder[] = [
  {
    id: 'OS-2024-001',
    clientId: '1',
    printerId: '1',
    technicianId: '1',
    status: OSStatus.COMPLETED,
    priority: Priority.MEDIUM,
    description: 'Manchas pretas na lateral da folha.',
    diagnosis: 'Cilindro do toner danificado.',
    solution: 'Troca do cartucho de toner e limpeza interna.',
    openedAt: '2024-05-01',
    closedAt: '2024-05-02',
    partsUsed: [{ partId: '3', quantity: 1 }],
    totalValue: 250
  },
  {
    id: 'OS-2024-002',
    clientId: '2',
    printerId: '2',
    technicianId: '2',
    status: OSStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    description: 'Atolamento de papel constante na gaveta 1.',
    openedAt: '2024-05-10',
    partsUsed: [],
    totalValue: 0
  },
  {
    id: 'OS-2024-003',
    clientId: '3',
    printerId: '4',
    status: OSStatus.PENDING,
    priority: Priority.CRITICAL,
    description: 'Erro SC542 no painel. Não imprime.',
    openedAt: '2024-05-12',
    partsUsed: [],
    totalValue: 0
  },
  {
    id: 'OS-2024-004',
    clientId: '1',
    printerId: '3',
    status: OSStatus.WAITING_PARTS,
    priority: Priority.LOW,
    description: 'Cabeça de impressão falhando cor magenta.',
    openedAt: '2024-05-08',
    partsUsed: [],
    totalValue: 0
  }
];