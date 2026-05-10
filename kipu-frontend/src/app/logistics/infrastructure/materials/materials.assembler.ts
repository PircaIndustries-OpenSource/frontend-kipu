import { MaterialResource, MaterialsResponse } from './materials.response';
import { MaterialEntity } from '../../domain/material.entity';

export class MaterialsAssembler {
  static toEntityFromResource(resource: MaterialResource): MaterialEntity {
    return {
      id: resource.id,
      name: resource.name,
      categoryId: resource.categoryId,
      subcategory: resource.subcategory,
      measureUnit: resource.measureUnit,
    };
  }
  static toEntitiesFromResponse(response: MaterialsResponse): MaterialEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }
}
