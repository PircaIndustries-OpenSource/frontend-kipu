import { SeismicResource, SeismicResponse } from '../models/seismic.response';
import { SeismicEntity } from '../../domain/seismic.entity';

export class SeismicAssembler {
  static toEntityFromResource(seismicResource: SeismicResource): SeismicEntity {
    const seismicEntity = new SeismicEntity();
    seismicEntity.id = seismicResource.id;
    seismicEntity.projectId = seismicResource.projectId;
    seismicEntity.sensorId = seismicResource.sensorId;
    seismicEntity.unit = seismicResource.unit;
    seismicEntity.lastLecture = seismicResource.lastLecture;
    seismicEntity.limit = seismicResource.limit;
    seismicEntity.location = seismicResource.location;
    seismicEntity.timeLecture = seismicResource.timeLecture;

    const states: Record<number, string> = { 1: 'NORMAL', 2: 'RISK' };
    seismicEntity.state = states[seismicResource.state] || 'UNKNOWN';

    return seismicEntity;
  }

  static toEntitiesFromResponse(seismicResponse: SeismicResponse): SeismicEntity[] {
    return seismicResponse.map((resource) => this.toEntityFromResource(resource));
  }

  static toResourceFromEntity(entity: SeismicEntity): SeismicResource {
    const states: Record<string, number> = { NORMAL: 1, RISK: 2 };

    return {
      id: entity.id,
      projectId: entity.projectId,
      sensorId: entity.sensorId,
      unit: entity.unit,
      lastLecture: entity.lastLecture,
      limit: entity.limit,
      location: entity.location,
      timeLecture: entity.timeLecture,
      state: states[entity.state] || 0, // Valor por defecto si es UNKNOWN
    } as SeismicResource;
  }
}
