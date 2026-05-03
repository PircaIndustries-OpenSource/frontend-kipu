export class MaterialEntity {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  currentStock: number;
  measureUnit: string;
  minimumLimit: number;
  status: string;
  suggestedSupplierId: string;

  constructor() {
    this.id = "";
    this.name = "";
    this.category = "";
    this.subcategory = "";
    this.currentStock = 0;
    this.measureUnit = "";
    this.minimumLimit = 0;
    this.status = "";
    this.suggestedSupplierId = "";
  }
}
