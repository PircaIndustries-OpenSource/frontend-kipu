export type GeolocalizationResponse = GeolocalizationResource[];
export interface GeolocalizationResource {
  numberId: number;
  id: string;
  name: string;
  projectId: string;
  longitude: number;
  latitude: number;
  state: number;
}
