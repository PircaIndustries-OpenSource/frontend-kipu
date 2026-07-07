import {RequestResource, RequestResponse} from './request.response';
import {RequestEntity} from '../../domain/request.entity';

export class RequestAssembler {
  static toEntityFromResource(resource: RequestResource): RequestEntity{
    return {
      id: String(resource.id),
      projectId: String(resource.projectId ?? ''),
      requestDate: resource.requestDate,
      deadline: resource.deadline,
      status: resource.status,
      priority: resource.priority,
      deliveryLocation: resource.deliveryLocation,
      budgetLineId: String(resource.budgetLineId ?? ''),
      purpose: resource.purpose,
      additionalNotes: resource.additionalNotes,
      suggestedSupplierId: String(resource.suggestedSupplierId ?? ''),
      attachments: resource.attachments,
      items: (resource.items || []).map(item => ({
        materialCatalogId: item.materialCatalogId,
        supplierId: item.supplierId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      requestedBy: resource.requestedBy,
      activity: resource.activity,
    }
  }
  static toEntitiesFromResponse(response: RequestResponse): RequestEntity[]{
    return response.map(resource => this.toEntityFromResource(resource));
  }
}
