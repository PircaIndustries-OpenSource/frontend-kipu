export type SupplierResponse = SupplierResource[];

export interface SupplierResource {
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
}
