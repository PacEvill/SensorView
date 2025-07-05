import { User } from './slices/user';
import { Deal } from './slices/deals';
import { Company } from './slices/companies';
import { Contact } from './slices/contacts';
import { Task } from './slices/tasks';
import { Document } from './slices/documents';
import { Lead, LeadsSlice } from './slices/leads';
import { UIState, Notification } from './slices/ui';

// Interface unificada do estado global
export interface AppState {
  // Estado
  user: User;
  deals: Deal[];
  companies: Company[];
  contacts: Contact[];
  tasks: Task[];
  documents: Document[];
  leads: Lead[];
  ui: UIState;
  isLoadingAuth: boolean;
  
  // Ações - Usuário
  updateUserProfile: (userData: Partial<User>) => void;

  // Ações - UI
  toggleDarkMode: () => void;
  setLastView: (view: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markNotificationRead: (id: number) => void;
  
  // Empresas
  addCompany: (company: Omit<Company, 'id' | 'createdAt'>) => void;
  updateCompany: (company: Partial<Company> & { id: number }) => void;
  deleteCompany: (id: number) => void;
  
  // Negociações
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => void;
  updateDeal: (deal: Partial<Deal> & { id: number }) => void;
  deleteDeal: (id: number) => void;
  
  // Tarefas
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  updateTask: (task: Partial<Task> & { id: number }) => void;
  deleteTask: (id: number) => void;
  toggleTaskComplete: (id: number) => void;
  
  // Contatos
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  updateContact: (contact: Partial<Contact> & { id: number }) => void;
  deleteContact: (id: number) => void;
  
  // Documentos
  addDocument: (document: Omit<Document, 'id' | 'uploadDate' | 'lastModified'>) => void;
  updateDocument: (document: Partial<Document> & { id: number }) => void;
  deleteDocument: (id: number) => void;
  archiveDocument: (id: number) => void;

  // Leads
  addLead: LeadsSlice['addLead'];
  updateLead: LeadsSlice['updateLead'];
  deleteLead: LeadsSlice['deleteLead'];
  convertLeadToDeal: LeadsSlice['convertLeadToDeal'];

  // Autenticação
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => void;
  
  // Utilitários
  formatDateTime: (date: string) => string;
  formatDate: (date: string) => string;
  getNextId: (items: { id: number }[]) => number; // Adicionar getNextId
}