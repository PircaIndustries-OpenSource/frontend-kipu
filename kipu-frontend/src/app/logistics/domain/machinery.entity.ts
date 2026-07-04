export class MachineryEntity {
  id: string;
  name: string;
  status: 'IN_USE' | 'URGENT_MAINTENANCE' | 'AVAILABLE';
  assignedTo: string;
  assignedWorkerId: string;
  registrationDate: string;
  maintenanceHours: string;
  assignmentDetail: string;
  projectId: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.status = 'AVAILABLE';
    this.assignedTo = '';
    this.assignedWorkerId = '';
    this.registrationDate = '';
    this.maintenanceHours = '';
    this.assignmentDetail = '';
    this.projectId = '';
  }
}

export class MachineryCatalogEntity {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  acquisitionDate: string | null;

  constructor() {
    this.id = '';
    this.name = '';
    this.brand = '';
    this.model = '';
    this.serialNumber = '';
    this.acquisitionDate = null;
  }
}
