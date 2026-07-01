export class MachineryEntity {
  id: string;
  name: string;
  status: 'IN_USE' | 'URGENT_MAINTENANCE' | 'AVAILABLE';
  assignedTo: string;
  assignedWorkerId: string;
  registrationDate: string;
  maintenanceHours: string;
  assignmentDetail: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.status = 'AVAILABLE';
    this.assignedTo = '';
    this.assignedWorkerId = '';
    this.registrationDate = '';
    this.maintenanceHours = '';
    this.assignmentDetail = '';
  }
}
