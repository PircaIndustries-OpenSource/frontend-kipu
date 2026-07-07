import {
  GeolocalizationResource,
  GeolocalizationResponse,
} from '../models/geolocalization.response';
import { GeolocalizationEntity } from '../../domain/geolocalization.entity';

export class GeolocalizationAssembler {
  static toEntityFromResource(
    geolocalizationResource: GeolocalizationResource,
  ): GeolocalizationEntity {
    const geo = new GeolocalizationEntity();
    geo.id = geolocalizationResource.id;
    geo.name = geolocalizationResource.name;
    geo.latitude = geolocalizationResource.latitude;
    geo.longitude = geolocalizationResource.longitude;
    geo.projectId = geolocalizationResource.projectId;
    geo.numberId = geolocalizationResource.numberId;

    const states: Record<number, string> = { 1: 'OPERATIVE', 2: 'NON OPERATIVE', 3: 'OUTSIDE OF LIMIT' };
    geo.state = states[geolocalizationResource.state] || 'OPERATIVE';

    return geo;
  }

  static toEntitiesFromResponse(
    geolocalizationResponse: GeolocalizationResponse,
  ): GeolocalizationEntity[] {
    return geolocalizationResponse.map((r) => this.toEntityFromResource(r));
  }

  static toResourceFromEntity(entity: GeolocalizationEntity): any {
    const states: Record<string, number> = {
      'OPERATIVE': 1,
      'NON OPERATIVE': 2,
      'OUTSIDE OF LIMIT': 3,
    };
    return {
      projectId: entity.projectId || '',
      sensorId: 'SNS-GEO-' + String(entity.numberId || entity.id).padStart(3, '0'),
      numberId: entity.numberId || 0,
      name: entity.name || '',
      state: states[entity.state] ?? 1,
      longitude: Number(entity.longitude) || 0,
      latitude: Number(entity.latitude) || 0,
    };
  }
}
