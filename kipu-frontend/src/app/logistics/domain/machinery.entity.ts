export class MachineryEntity {
  id: string;
  name: string;
  status: 'IN_USE' | 'URGENT_MAINTENANCE' | 'AVAILABLE';
  physicalStatus: string;
  assignedTo: string;
  registrationDate: string;
  maintenanceHours: string;
  assignmentDetail: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.status = 'AVAILABLE';
    this.physicalStatus = '';
    this.assignedTo = '';
    this.registrationDate = '';
    this.maintenanceHours = '';
    this.assignmentDetail = '';
  }
}
