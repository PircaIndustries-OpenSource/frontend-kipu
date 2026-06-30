/**
 * Complete domain entity for progress records.
 * Includes scheduling, execution, and weather metrics.
 */
export interface ProjectProgress {
  id: number;
  projectId: string;
  projectName: string;
  activityName: string;
  details: string;
  specialty: string;
  status: ProgressStatus;
  currentPercentage: number;
  startDate: Date;
  endDate: Date;
  lastUpdate: Date;
  // New fields from mockup
  responsible?: string;
  workers?: number;
  weather?: string;
  weight?: number;
  isMiniAdvance?: boolean;
}

export type ProgressStatus = 'Active' | 'Finished' | 'Delayed';
