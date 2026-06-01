import {
  GeolocalizationResource,
  GeolocalizationResponse,
} from '../models/geolocalization.response';
import { GeolocalizationEntity } from '../../domain/geolocalization.entity';

export class GeolocalizationAssembler {
  static toEntityFromResource(
    geolocalizationResource: GeolocalizationResource,
  ): GeolocalizationEntity {
    const geolocalizationEntity = new GeolocalizationEntity();
    geolocalizationEntity.id = geolocalizationResource.id;
    geolocalizationEntity.name = geolocalizationResource.name;
    geolocalizationEntity.latitude = geolocalizationResource.latitude;
    geolocalizationEntity.longitude = geolocalizationResource.longitude;
    geolocalizationEntity.projectId = geolocalizationResource.projectId;
    geolocalizationEntity.numberId = geolocalizationResource.numberId;

    const states: Record<number, string> = { 1: 'OPERATIVE', 2: 'NON OPERATIVE' };
    geolocalizationEntity.state = states[geolocalizationResource.state] || 'OUTSIDE OF LIMIT';

    return geolocalizationEntity;
  }
  static toEntitiesFromResponse(
    geolocalizationResponse: GeolocalizationResponse,
  ): GeolocalizationEntity[] {
    return geolocalizationResponse.map((resource) => this.toEntityFromResource(resource));
  }
  static toResourceFromEntity(entity: GeolocalizationEntity): GeolocalizationResource {
    const states: Record<string, number> = {
      'OPERATIVE': 1,
      'NON OPERATIVE': 2,
      'OUTSIDE OF LIMIT': 0,
    };
    return {
      id: entity.id,
      numberId: entity.numberId,
      name: entity.name,
      projectId: entity.projectId,
      longitude: entity.longitude,
      latitude: entity.latitude,
      state: states[entity.state] ?? 0,
    } as GeolocalizationResource;
  }
}
