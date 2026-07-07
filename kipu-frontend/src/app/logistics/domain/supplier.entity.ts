export class SupplierEntity {
  id: string;
  ruc: string;
  onboarded: string;
  socialReason: string;
  contact: string;
  phone: string;
  email: string;
  categories: string;
  paymentTerms: string;
  isActive: boolean;

  constructor() {
    this.id = '';
    this.ruc = '';
    this.onboarded = '';
    this.socialReason = '';
    this.contact = '';
    this.phone = '';
    this.email = '';
    this.categories = '';
    this.paymentTerms = '';
    this.isActive = true;
  }
}
