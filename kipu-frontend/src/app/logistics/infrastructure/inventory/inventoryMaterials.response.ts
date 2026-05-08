export type InventoryMaterialsResponse = InventoryMaterialResource[];

export interface InventoryMaterialResource {
  id: string;
  materialId: string;
  currentStock: number;
  miniumStock: number;
  location: string;
}
