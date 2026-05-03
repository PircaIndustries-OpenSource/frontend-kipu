import {MaterialResource, MaterialsResponse} from './materials.response';
import {MaterialEntity} from '../domain/material.entity';

export class MaterialsAssembler {
  static toEntityFromResource(resource: MaterialResource): MaterialEntity{
    return {
      id: resource.id,
      name: resource.name,
      category: resource.category,
      subcategory: resource.subcategory,
      currentStock: resource.currentStock,
      measureUnit: resource.measureUnit,
      minimumLimit: resource.minimumLimit,
      status: resource.status ,
      suggestedSupplierId: resource.suggestedSupplierId,
    }
  }
  static toEntitiesFromResponse(response: MaterialsResponse): MaterialEntity[]{
    return response.map(resource => this.toEntityFromResource(resource));
  }
}
