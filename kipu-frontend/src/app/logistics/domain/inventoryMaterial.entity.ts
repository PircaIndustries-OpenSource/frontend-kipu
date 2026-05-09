export class InventoryMaterialEntity{
  id: string;
  materialId: string;
  currentStock: number;
  miniumStock: number;
  location: string;

  constructor() {
    this.id = '';
    this.materialId = '';
    this.currentStock = 0;
    this.miniumStock = 0;
    this.location = '';
  }
}

export type InventoryViewModel = InventoryMaterialEntity & {
  materialName: string;
  materialCategory: string;
  materialUnit: string;
  materialSubcategory: string;
};

