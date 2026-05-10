/**
 * Represents the raw JSON data structure received from the API endpoint.
 */
export interface ProgressResponse {
  id: number;
  projectId: number;
  projectName: string; // Added for the new column
  activityName: string;
  details: string;
  specialty: string;
  status: string;
  currentPercentage: number;
  lastUpdate: string;
}
