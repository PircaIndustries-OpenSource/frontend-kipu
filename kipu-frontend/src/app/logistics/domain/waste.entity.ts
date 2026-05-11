export class WasteEntity {
  id: string;
  projectId: string;
  materialId: string;
  quantity: number;
  date: string;
  description: string;
  reportedBy: string;
  photoUrl: string;

  constructor() {
    this.id = '';
    this.projectId = '';
    this.materialId = '';
    this.quantity = 0;
    this.date = '';
    this.description = '';
    this.reportedBy = '';
    this.photoUrl = '';
  }
}
