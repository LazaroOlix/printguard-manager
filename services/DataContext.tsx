import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Client, Printer, Part, ServiceOrder, Technician, OSStatus } from '../types';
import { mockClients, mockPrinters, mockParts, mockOrders, mockTechnicians } from './data';

interface User {
  name: string;
  email: string;
  role: string;
  initials: string;
}

interface DataContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  clients: Client[];
  printers: Printer[];
  parts: Part[];
  orders: ServiceOrder[];
  technicians: Technician[];
  addClient: (client: Client) => void;
  addPrinter: (printer: Printer) => void;
  addPart: (part: Part) => void;
  updatePartQuantity: (id: string, quantity: number) => void;
  addOrder: (order: ServiceOrder) => void;
  deleteOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: OSStatus, resolution?: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper para persistência
const usePersistedState = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- AUTH STATE ---
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('printguard_user');
    return saved ? JSON.parse(saved) : null;
  });

  const getUsersDB = () => {
    const db = localStorage.getItem('printguard_users_db');
    if (db) return JSON.parse(db);
    const defaultUser = { 
      name: 'Carlos Silva', 
      email: 'admin@printguard.com', 
      password: '123', 
      role: 'Gerente',
      initials: 'CS' 
    };
    localStorage.setItem('printguard_users_db', JSON.stringify([defaultUser]));
    return [defaultUser];
  };

  const login = (email: string, password: string) => {
    const users = getUsersDB();
    const found = users.find((u: any) => u.email === email && u.password === password);
    
    if (found) {
      const userData = {
        name: found.name,
        email: found.email,
        role: found.role || 'Técnico',
        initials: found.initials || found.name.substring(0,2).toUpperCase()
      };
      setUser(userData);
      localStorage.setItem('printguard_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string) => {
    const users = getUsersDB();
    if (users.find((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      name,
      email,
      password,
      role: 'Técnico',
      initials: name.substring(0, 2).toUpperCase()
    };

    users.push(newUser);
    localStorage.setItem('printguard_users_db', JSON.stringify(users));
    
    const userData = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        initials: newUser.initials
    };
    setUser(userData);
    localStorage.setItem('printguard_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('printguard_user');
  };

  // --- DATA STATE WITH PERSISTENCE ---
  // Agora usamos usePersistedState para manter os dados salvos
  const [clients, setClients] = usePersistedState<Client[]>('printguard_clients', mockClients);
  const [printers, setPrinters] = usePersistedState<Printer[]>('printguard_printers', mockPrinters);
  const [parts, setParts] = usePersistedState<Part[]>('printguard_parts', mockParts);
  const [orders, setOrders] = usePersistedState<ServiceOrder[]>('printguard_orders', mockOrders);
  
  // Técnicos geralmente são fixos ou gerenciados via usuários, mas vamos manter simples por enquanto
  const [technicians] = useState<Technician[]>(mockTechnicians);

  const addClient = (client: Client) => {
    setClients(prev => [client, ...prev]);
  };

  const addPrinter = (printer: Printer) => {
    setPrinters(prev => [printer, ...prev]);
  };

  const addPart = (part: Part) => {
    setParts(prev => [part, ...prev]);
  };

  const updatePartQuantity = (id: string, quantity: number) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, quantity } : p));
  };

  const addOrder = (order: ServiceOrder) => {
    setOrders(prev => [order, ...prev]);
  };

  const deleteOrder = (id: string) => {
    // Garante que a atualização de estado seja detectada
    setOrders(prev => {
      const filtered = prev.filter(order => order.id !== id);
      return [...filtered]; // Retorna nova referência de array
    });
  };

  const updateOrderStatus = (id: string, status: OSStatus, resolution?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        return {
          ...o,
          status,
          solution: resolution || o.solution,
          closedAt: status === OSStatus.COMPLETED ? new Date().toISOString().split('T')[0] : o.closedAt
        };
      }
      return o;
    }));
  };

  return (
    <DataContext.Provider value={{
      user,
      login,
      register,
      logout,
      clients,
      printers,
      parts,
      orders,
      technicians,
      addClient,
      addPrinter,
      addPart,
      updatePartQuantity,
      addOrder,
      deleteOrder,
      updateOrderStatus
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};