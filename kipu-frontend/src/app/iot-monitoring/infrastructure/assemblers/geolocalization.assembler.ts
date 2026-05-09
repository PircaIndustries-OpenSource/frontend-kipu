import { GeolocalizationResource, GeolocalizationResponse, } from '../models/geolocalization.response';
import { GeolocalizationEntity } from '../../domain/geolocalization.entity';

export class GeolocalizationAssembler {
  static toEntityFromResource(geolocalizationResource: GeolocalizationResource): GeolocalizationEntity {
    const geolocalizationEntity = new GeolocalizationEntity();
    geolocalizationEntity.id = geolocalizationResource.id;
    geolocalizationEntity.name = geolocalizationResource.name;
    geolocalizationEntity.latitude = geolocalizationResource.latitude;
    geolocalizationEntity.longitude = geolocalizationResource.longitude;
    geolocalizationEntity.projectId = geolocalizationResource.projectId;

    const states: Record<number, string> = {1: 'OPERATIVE', 2: 'NON OPERATIVE'};
    geolocalizationEntity.state = states[geolocalizationResource.state] || 'OUTSIDE OF LIMIT';

    return geolocalizationEntity;
  }
  static toEntitiesFromResponse(geolocalizationResponse: GeolocalizationResponse): GeolocalizationEntity[] {
    return geolocalizationResponse.map((resource) => this.toEntityFromResource(resource));
  }
}
