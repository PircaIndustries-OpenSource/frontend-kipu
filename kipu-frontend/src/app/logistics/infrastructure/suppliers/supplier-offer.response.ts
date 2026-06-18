export type SupplierOfferResponse = SupplierOfferResource[];

export interface SupplierOfferResource {
  id: number;
  supplierId: number;
  materialCatalogId: number;
  unitPrice: number;
}
