export type MachineryResponse = MachineryResource[];
export interface MachineryResource {
  id: string;
  name: string;
  status: 'IN_USE' | 'URGENT_MAINTENANCE' | 'AVAILABLE';
  assignedTo: string;
  registrationDate: string;
  maintenanceHours: string;
  assignmentDetail: string;
}
