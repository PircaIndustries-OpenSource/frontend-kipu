import { ConcreteResource, ConcreteResponse, } from '../models/concrete.response';
import {ConcreteEntity} from '../../domain/concrete.entity';

export class ConcreteAssembler {
  static toEntityFromResource(concreteResource: ConcreteResource): ConcreteEntity {
    const concreteSensor = new ConcreteEntity()

    if (concreteResource.id && concreteResource.id.trim().length > 0)
      concreteSensor.id = concreteResource.id;
    if (concreteResource.name && concreteResource.name.trim().length > 0)
      concreteSensor.name = concreteResource.name;
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

  static toEntitiesFromResponse(response: ConcreteResponse): ConcreteEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

}
