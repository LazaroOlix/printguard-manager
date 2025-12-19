export enum OSStatus {
  PENDING = 'Pendente',
  IN_PROGRESS = 'Em Andamento',
  WAITING_PARTS = 'Aguardando Peças',
  COMPLETED = 'Concluída',
  CANCELED = 'Cancelada'
}

export enum Priority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
  CRITICAL = 'Crítica'
}

export interface Client {
  id: string;
  name: string;
  document: string; // CNPJ/CPF
  address: string;
  contact: string;
}

export interface Printer {
  id: string;
  clientId: string;
  brand: string;
  model: string;
  serialNumber: string;
  pageCounter: number;
  lastMaintenanceDate: string;
  contractType: 'Avulso' | 'Mensal' | 'Custo por Página';
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  cost: number;
  price: number;
}

export interface ServiceOrder {
  id: string;
  clientId: string;
  printerId: string;
  technicianId?: string;
  status: OSStatus;
  priority: Priority;
  description: string;
  diagnosis?: string;
  solution?: string;
  openedAt: string;
  closedAt?: string;
  partsUsed: { partId: string; quantity: number }[];
  totalValue: number;
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  active: boolean;
}