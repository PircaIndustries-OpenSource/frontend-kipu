export type SeismicResponse = SeismicResource[];
export interface SeismicResource {
  id: string;
  projectId: string;
  sensorId: string;
  unit: string;
  location: string;
  state: number;
  lastLecture: number;
  limit: number;
  timeLecture: string;
}
