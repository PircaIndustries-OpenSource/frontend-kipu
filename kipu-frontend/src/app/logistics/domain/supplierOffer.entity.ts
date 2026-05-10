export class SupplierOfferEntity {
  id: string;
  supplierId: string;
  materialId: string;
  unitPrice: number;
  constructor() {
    this.id = '';
    this.supplierId = '';
    this.materialId = '';
    this.unitPrice = 0;
  }
}
