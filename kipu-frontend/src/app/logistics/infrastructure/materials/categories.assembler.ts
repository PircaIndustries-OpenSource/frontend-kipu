import { CategoriesResponse, CategoryResource } from './categories.response';
import { CategoryEntity } from '../../domain/category.entity';

export class CategoriesAssembler {
  static toEntityFromResource(resource: CategoryResource): CategoryEntity {
    return {
      id: resource.id,
      name: resource.name,
      description: resource.description,
      isActive: resource.isActive,
    };
  }
  static toEntitiesFromResponse(response: CategoriesResponse): CategoryEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }
}
