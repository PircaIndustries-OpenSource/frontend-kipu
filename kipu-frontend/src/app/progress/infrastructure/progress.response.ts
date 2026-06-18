export interface ProgressResponse {
  id: number;
  projectId: string | number;
  projectName: string;
  activityName: string;
  details: string;
  specialty: string;
  status: string;
  currentPercentage: number;
  startDate: string; // We add this
  endDate: string; // We add this
  lastUpdate: string;

  responsible?: string;
  workers?: number;
  weather?: string;

  // Mapping the database tracking keys
  weight?: number;
  isMiniAdvance: boolean;
  parentId?: number | null;
}
