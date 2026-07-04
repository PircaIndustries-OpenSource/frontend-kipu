import { MachineryResource, MachineryResponse, MachineryCatalogResource, MachineryCatalogResponse } from './machinery.response';
import { MachineryEntity, MachineryCatalogEntity } from '../../domain/machinery.entity';

export class MachineryAssembler {
  static toEntityFromResource(resource: MachineryResource): MachineryEntity {
    return {
      id: resource.id,
      name: resource.name,
      status: resource.status,
      assignedTo: resource.assignedTo,
      assignedWorkerId: resource.assignedWorkerId || '',
      registrationDate: resource.registrationDate,
      maintenanceHours: resource.maintenanceHours,
      assignmentDetail: resource.assignmentDetail,
      projectId: resource.projectId || '',
    };
  }

  static toEntitiesFromResponse(response: MachineryResponse): MachineryEntity[] {
    return response.map((r) => this.toEntityFromResource(r));
  }
}

export class MachineryCatalogAssembler {
  static toEntityFromResource(resource: MachineryCatalogResource): MachineryCatalogEntity {
    const entity = new MachineryCatalogEntity();
    entity.id = resource.id;
    entity.name = resource.name;
    entity.brand = resource.brand;
    entity.model = resource.model;
    entity.serialNumber = resource.serialNumber;
    entity.acquisitionDate = resource.acquisitionDate;
    return entity;
  }

  static toEntitiesFromResponse(response: MachineryCatalogResponse): MachineryCatalogEntity[] {
    return response.map((r) => this.toEntityFromResource(r));
  }
}
