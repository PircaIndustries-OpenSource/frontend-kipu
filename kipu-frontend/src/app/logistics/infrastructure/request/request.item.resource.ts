export interface MaterialRequestItemResource {
  id: number | null;
  materialCatalogId: number;
  supplierId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
