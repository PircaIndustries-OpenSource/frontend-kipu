import { MaterialResource, MaterialsResponse } from './materials.response';
import { MaterialEntity } from '../../domain/material.entity';

export class MaterialsAssembler {
  static toEntityFromResource(resource: MaterialResource): MaterialEntity {
    return {
      id: String(resource.id),
      name: resource.name,
      categoryId: String(resource.categoryId),
      measureUnit: resource.measureUnit,
    };
  }
  static toEntitiesFromResponse(response: MaterialsResponse): MaterialEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }
}
