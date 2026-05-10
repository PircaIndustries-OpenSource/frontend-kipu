/**
 * Domain entity representing a specific construction activity progress.
 */
export interface ProjectProgress {
  id: number;
  projectId: number;
  projectName: string;
  activityName: string;
  details: string;
  specialty: string;
  status: ProgressStatus;
  currentPercentage: number;
  lastUpdate: Date;
}

/**
 * Allowed statuses for an activity.
 */
export type ProgressStatus = 'Active' | 'Finished' | 'Delayed';
