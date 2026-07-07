import { InventoryMaterialRawResource, InventoryMaterialsResponse } from './inventoryMaterials.response';
import { InventoryMaterialEntity } from '../../domain/inventoryMaterial.entity';

export class InventoryMaterialAssembler {
  static toEntityFromResource(resource: InventoryMaterialRawResource): InventoryMaterialEntity {
    return {
      id: String(resource.id),
      materialId: String(resource.materialCatalogId),
      currentStock: resource.currentStock,
      miniumStock: resource.minimumStock,
      location: resource.location || '',
    };
  }
  static toEntitiesFromResponse(response: InventoryMaterialsResponse): InventoryMaterialEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }
}
