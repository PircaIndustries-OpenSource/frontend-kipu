import { SeismicResource, SeismicResponse } from '../models/seismic.response';
import { SeismicEntity } from '../../domain/seismic.entity';

export class SeismicAssembler {
  static toEntityFromResource(seismicResource: SeismicResource): SeismicEntity {
    const seismicEntity = new SeismicEntity();
    seismicEntity.id = seismicResource.id;
    seismicEntity.projectId = seismicResource.projectId;
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
}
