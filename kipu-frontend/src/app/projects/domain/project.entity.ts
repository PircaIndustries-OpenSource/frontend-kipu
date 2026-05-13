export class ProjectEntity {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate?: string;
  totalBudget?: number;
  location: string;
  createdAt: string;
  createdBy: string;
  statusJustification?: string;
  imageUrl?: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.description = '';
    this.status = 'PLANNED';
    this.startDate = '';
    this.location = '';
    this.createdAt = '';
    this.createdBy = '';
  }
}
