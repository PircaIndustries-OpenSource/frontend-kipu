export type SupplierOfferResponse = SupplierOfferResource[];

export interface SupplierOfferResource {
  id: string;
  supplierId: string;
  materialId: string;
  unitPrice: number;
}
