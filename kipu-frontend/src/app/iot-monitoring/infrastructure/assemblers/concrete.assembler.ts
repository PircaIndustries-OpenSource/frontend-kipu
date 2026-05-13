import { ConcreteResource, ConcreteResponse } from '../models/concrete.response';
import { ConcreteEntity } from '../../domain/concrete.entity';

export class ConcreteAssembler {
  static toEntityFromResource(concreteResource: ConcreteResource): ConcreteEntity {
    const concreteSensor = new ConcreteEntity();

    if (concreteResource.id && concreteResource.id.trim().length > 0)
      concreteSensor.id = concreteResource.id;
    concreteSensor.projectId = concreteResource.projectId;
    if (concreteResource.sensorId && concreteResource.sensorId.trim().length > 0)
      concreteSensor.sensorId = concreteResource.sensorId;
    if (concreteResource.location && concreteResource.location.trim().length > 0)
      concreteSensor.location = concreteResource.location;
    concreteSensor.unit = concreteResource.unit;
    concreteSensor.temperature = concreteResource.temperature;
    concreteSensor.humidity = concreteResource.humidity;
    concreteSensor.limit = concreteResource.limit;

    const states: Record<number, string> = { 1: 'ONLINE', 2: 'OFFLINE' };
    concreteSensor.state = states[concreteResource.state] || 'UNKNOWN';

    return concreteSensor;
  }

  static toEntitiesFromResponse(concreteResponse: ConcreteResponse): ConcreteEntity[] {
    return concreteResponse.map((resource) => this.toEntityFromResource(resource));
  }

  static toResourceFromEntity(entity: ConcreteEntity): ConcreteResource {
    const states: Record<string, number> = { ONLINE: 1, OFFLINE: 2 };

    return {
      id: entity.id,
      projectId: entity.projectId,
      sensorId: entity.sensorId,
      location: entity.location,
      unit: entity.unit,
      temperature: entity.temperature,
      humidity: entity.humidity,
      limit: entity.limit,
      state: states[entity.state] || 0, // Valor por defecto si es UNKNOWN
    } as ConcreteResource;
  }
}
