export type InventoryMaterialsResponse = InventoryMaterialResource[];

export interface InventoryMaterialResource {
  id: string;
  materialCatalogId: string;
  currentStock: number;
  minimumStock: number;
  location: string;
}
