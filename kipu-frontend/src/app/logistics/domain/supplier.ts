export class Supplier {
  id: string;
  ruc: string;
  onboarded: string;
  socialReason: string;
  contact: string;
  phone: string;
  email: string;
  categories: string;
  paymentTerms: string;
  status: string;
  offerMaterials: SupplierOfferEntity[];

  constructor() {
    this.id = '';
    this.ruc = '';
    this.onboarded = '';
    this.socialReason = '';
    this.contact = '';
    this.phone ='';
    this.email ='';
    this.categories ='';
    this.paymentTerms ='';
    this.status = '';
    this.offerMaterials = [];
  }
}
export class SupplierOfferEntity{
  supplierId: string;
  materialId: string;
  unitPrice: number;
  constructor() {
    this.supplierId = '';
    this.materialId = '';
    this.unitPrice = 0;
  }
}
