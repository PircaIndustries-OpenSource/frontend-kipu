import { WasteResource, WasteResponse } from './waste.response';
import { WasteEntity } from '../domain/waste.entity';

export class WasteAssembler {
  static toEntityFromResource(resource: WasteResource): WasteEntity {
    return {
      id: resource.id,
      projectId: resource.projectId,
      materialId: resource.materialId,
      quantity: resource.quantity,
      unit: resource.unit,
      classificationType: resource.classificationType,
      date: resource.date,
      description: resource.description,
      reportedBy: resource.reportedBy,
      photoUrl: resource.photoUrl,
    };
  }
  static toEntitiesFromResponse(response: WasteResponse): WasteEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }
}
