/**
 * Domain entity representing the progress of a construction project.
 */
export interface ProjectProgress {
  id: number;
  projectId: number;
  projectName: string;
  location: string;
  status: ProgressStatus;
  imageUrl: string;
  currentPercentage: number;
  lastUpdate: Date;
}

/**
 * Allowed statuses for a project's progress.
 */
export type ProgressStatus = 'Active' | 'Progress' | 'Finished';
