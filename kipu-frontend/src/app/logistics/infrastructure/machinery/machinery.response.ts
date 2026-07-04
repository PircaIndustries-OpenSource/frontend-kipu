export type MachineryResponse = MachineryResource[];
export interface MachineryResource {
  id: string;
  name: string;
  status: 'IN_USE' | 'URGENT_MAINTENANCE' | 'AVAILABLE';
  assignedTo: string;
  assignedWorkerId: string;
  registrationDate: string;
  maintenanceHours: string;
  assignmentDetail: string;
  projectId: string;
}

export type MachineryCatalogResponse = MachineryCatalogResource[];
export interface MachineryCatalogResource {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  acquisitionDate: string | null;
}

export interface CreateMachineryCatalogRequest {
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  acquisitionDate?: string;
}
