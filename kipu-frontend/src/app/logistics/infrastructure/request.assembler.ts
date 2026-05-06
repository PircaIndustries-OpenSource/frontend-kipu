import {RequestResource, RequestResponse} from './request.response';
import {RequestEntity} from '../domain/request.entity';

export class RequestAssembler {
  static toEntityFromResource(resource: RequestResource): RequestEntity{
    return {
      id: resource.id,
      projectId: resource.projectId,
      requestDate: resource.requestDate,
      deadline: resource.deadline,
      status: resource.status,
      priority: resource.priority,
      deliveryLocation: resource.deliveryLocation,
      budgetLineId: resource.budgetLineId,
      purpose: resource.purpose,
      additionalNotes: resource.additionalNotes,
      suggestedSupplierId: resource.suggestedSupplierId,
      attachments: resource.attachments,
      item: resource.item,
      requestedBy: resource.requestedBy,
      activity: resource.activity,
    }
  }
  static toEntitiesFromResponse(response: RequestResponse): RequestEntity[]{
    return response.map(resource => this.toEntityFromResource(resource));
  }
}
