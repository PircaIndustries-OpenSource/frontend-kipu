import { HopperResource, HopperResponse } from '../models/hopper.response';
import { HopperEntity } from '../../domain/hopper.entity';

export class HopperAssembler {
  static toEntityFromResource(hopperResource: HopperResource): HopperEntity {
    const hopperEntity = new HopperEntity();

    hopperEntity.id = hopperResource.id;
    hopperEntity.projectId = hopperResource.projectId;
    hopperEntity.sensorId = hopperResource.sensorId;
    hopperEntity.limit = hopperResource.limit;
    hopperEntity.unit = hopperResource.unit;
    hopperEntity.lastLecture = hopperResource.lastLecture;

    const states: Record<number, string> = { 1: 'OPTIMUM', 2: 'CRITIC' };
    hopperEntity.state = states[hopperResource.state] || 'UNKNOWN';

    hopperEntity.name = hopperResource.name;

    return hopperEntity;
  }
  static toEntitiesFromResponse(hopperResponse: HopperResponse): HopperEntity[] {
    return hopperResponse.map((resource) => this.toEntityFromResource(resource));
  }

  static toResourceFromEntity(entity: HopperEntity): HopperResource {
    const states: Record<string, number> = { NORMAL: 1, RISK: 2 };

    return {
      id: entity.id,
      projectId: entity.projectId,
      sensorId: entity.sensorId,
      unit: entity.unit,
      lastLecture: entity.lastLecture,
      limit: entity.limit,
      name: entity.name,
      state: states[entity.state] || 0, // Valor por defecto si es UNKNOWN
    } as HopperResource;
  }
}
