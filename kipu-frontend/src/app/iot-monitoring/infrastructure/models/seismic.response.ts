export type SeismicResponse = SeismicResource[];
export interface SeismicResource {
  id: string;
  projectId: string;
  unit: string;
  location: string;
  state: string;
  lastLecture: number;
  limit: number;
  timeLecture: string;
}
