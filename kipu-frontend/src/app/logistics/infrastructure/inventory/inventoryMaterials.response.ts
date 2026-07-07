export type InventoryMaterialsResponse = InventoryMaterialRawResource[];

export interface InventoryMaterialRawResource {
  id: number | string;
  projectId?: string;
  materialCatalogId: number;
  currentStock: number;
  minimumStock: number;
  location: string;
}

export interface InventoryMaterialResource {
  id: string;
  materialId: string;
  currentStock: number;
  miniumStock: number;
  location: string;
}
