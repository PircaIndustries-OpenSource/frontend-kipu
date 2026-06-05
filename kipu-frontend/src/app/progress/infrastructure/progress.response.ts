export interface ProgressResponse {
  id: number;
  projectId: number;
  projectName: string;
  activityName: string;
  details: string;
  specialty: string;
  status: string;
  currentPercentage: number;
  startDate: string; // We add this
  endDate: string; // We add this
  lastUpdate: string;
  weight?: number;
}
