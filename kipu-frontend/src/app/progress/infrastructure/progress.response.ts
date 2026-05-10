/**
 * Represents the raw JSON data structure received from the API endpoint.
 * Path: /api/v1/progress
 */
export interface ProgressResponse {
  id: number;
  projectId: number;
  projectName: string;
  location: string;
  status: string;
  imageUrl: string;
  currentPercentage: number;
  lastUpdate: string;
}
