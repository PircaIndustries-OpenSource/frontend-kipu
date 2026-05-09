export type GeolocalizationResponse = GeolocalizationResource[];
export interface GeolocalizationResource {
  id: string;
  name: string;
  projectId: string;
  longitude: number;
  latitude: number;
  state: number;
}
