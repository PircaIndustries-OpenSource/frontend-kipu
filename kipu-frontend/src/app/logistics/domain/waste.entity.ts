export class WasteEntity {
  id: string;
  projectId: string;
  materialCatalogId: number;
  quantity: number;
  unit: string;
  classificationType: string;
  date: string;
  description: string;
  reportedBy: string;
  photoUrl: string;

  constructor() {
    this.id = '';
    this.projectId = '';
    this.materialCatalogId = 0;
    this.quantity = 0;
    this.unit = '';
    this.classificationType = 'ROTURA';
    this.date = '';
    this.description = '';
    this.reportedBy = '';
    this.photoUrl = '';
  }
}
