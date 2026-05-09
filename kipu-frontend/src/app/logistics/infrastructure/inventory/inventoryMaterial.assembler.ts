import { InventoryMaterialResource, InventoryMaterialsResponse } from './inventoryMaterials.response';
import { InventoryMaterialEntity } from '../../domain/inventoryMaterial.entity';

export class InventoryMaterialAssembler {
  static toEntityFromResource(resource: InventoryMaterialResource): InventoryMaterialEntity {
    return {
      id: resource.id,
      materialId: resource.materialId,
      currentStock: resource.currentStock,
      miniumStock: resource.miniumStock,
      location: resource.location,
    };
  }
  static toEntitiesFromResponse(response: InventoryMaterialsResponse): InventoryMaterialEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }
}
