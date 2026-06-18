export type SupplierResponse = SupplierResource[];

export interface SupplierResource {
  id: string;
  ruc: string;
  socialReason: string;
  contact: string;
  phone: string;
  email: string;
  paymentTerms: string;
  isActive: boolean;
}
