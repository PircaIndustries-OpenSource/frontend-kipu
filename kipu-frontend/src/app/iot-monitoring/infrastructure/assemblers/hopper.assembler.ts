import { HopperResource, HopperResponse } from '../models/hopper.response';
import { HopperEntity } from '../../domain/hopper.entity';

export class HopperAssembler {
  static toEntityFromResource(hopperResource: HopperResource): HopperEntity {
    const hopperEntity = new HopperEntity();
    hopperEntity.id = hopperResource.id;
    hopperEntity.projectId = hopperResource.projectId;
    hopperEntity.sensorId = hopperResource.sensorId;
    hopperEntity.limit = hopperResource.safetyLimit ?? hopperResource.limit ?? 0;
    hopperEntity.unit = hopperResource.unit;
    hopperEntity.lastLecture = hopperResource.lastLecture;
    hopperEntity.name = hopperResource.name;

    const states: Record<number, string> = { 1: 'OPTIMUM', 2: 'ALERT', 3: 'CRITIC' };
    hopperEntity.state = states[hopperResource.state] || 'UNKNOWN';

    return hopperEntity;
  }

  static toEntitiesFromResponse(hopperResponse: HopperResponse): HopperEntity[] {
    return hopperResponse.map((r) => this.toEntityFromResource(r));
  }

  static toResourceFromEntity(entity: HopperEntity): any {
    const states: Record<string, number> = { OPTIMUM: 1, ALERT: 2, CRITIC: 3 };
    return {
      projectId: entity.projectId || '',
      sensorId: entity.sensorId || '',
      name: entity.name || '',
      unit: entity.unit || '',
      state: states[entity.state] ?? 1,
      lastLecture: Number(entity.lastLecture) || 0,
      safetyLimit: Number(entity.limit) || 0,
    };
  }
}
