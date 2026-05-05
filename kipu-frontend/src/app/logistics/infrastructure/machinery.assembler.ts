import { MachineryResource, MachineryResponse } from './machinery.response';
import { MachineryEntity } from '../domain/machinery.entity';

export class MachineryAssembler{
  static toEntityFromResource(resource: MachineryResource): MachineryEntity {
    return {
      id: resource.id,
      name: resource.name,
      status: resource.status,
      physicalStatus: resource.physicalStatus,
      assignedTo: resource.assignedTo,
      registrationDate: resource.registrationDate,
      maintenanceHours: resource.maintenanceHours,
      assignmentDetail: resource.assignmentDetail,
    };
  }
  static toEntitiesFromResponse(response: MachineryResponse): MachineryEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }
}
