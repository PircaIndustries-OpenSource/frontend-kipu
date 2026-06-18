import {RequestResource, RequestResponse} from './request.response';
import {RequestEntity, RequestItem} from '../../domain/request.entity';
import {MaterialRequestItemResource} from './request.item.resource';

export class RequestAssembler {
  static toEntityFromResource(resource: RequestResource): RequestEntity{
    return {
      id: String(resource.id),
      projectId: '',
      requestDate: '',
      deadline: resource.deadline,
      status: resource.requestStatus,
      priority: resource.requestPriority,
      deliveryLocation: resource.deliveryLocation,
      budgetLineId: resource.budgetLineId != null ? String(resource.budgetLineId) : null,
      purpose: resource.purpose ?? '',
      additionalNotes: resource.additionalNotes ?? '',
      suggestedSupplierId: '',
      attachments: [],
      items: resource.items.map(item => ({
        supplierOfferId: String(item.supplierId),
        materialCatalogId: String(item.materialCatalogId),
        supplierId: String(item.supplierId),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      requestedBy: String(resource.requestedBy),
      activity: null,
    }
  }
  static toEntitiesFromResponse(response: RequestResponse): RequestEntity[]{
    return response.map(resource => this.toEntityFromResource(resource));
  }
}
