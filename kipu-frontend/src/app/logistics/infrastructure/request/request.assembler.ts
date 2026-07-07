import {RequestResource, RequestResponse} from './request.response';
import {RequestEntity} from '../../domain/request.entity';

export class RequestAssembler {
  static toEntityFromResource(resource: RequestResource): RequestEntity{
    return {
      id: String(resource.id),
      projectId: resource.projectId || '',
      requestDate: resource.createdAt || '',
      deadline: resource.deadline ?? '',
      status: resource.requestStatus || resource.status || '',
      priority: resource.requestPriority || resource.priority || '',
      deliveryLocation: resource.deliveryLocation ?? '',
      budgetLineId: String(resource.budgetLineId ?? ''),
      purpose: resource.purpose ?? '',
      additionalNotes: resource.additionalNotes ?? '',
      suggestedSupplierId: String(resource.suggestedSupplierId ?? ''),
      attachments: [],
      items: (resource.items || []).map(item => ({
        materialCatalogId: item.materialCatalogId,
        supplierId: item.supplierId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      requestedBy: String(resource.requestedBy ?? ''),
      activity: '',
    }
  }
  static toEntitiesFromResponse(response: RequestResponse): RequestEntity[]{
    return response.map(resource => this.toEntityFromResource(resource));
  }
}
