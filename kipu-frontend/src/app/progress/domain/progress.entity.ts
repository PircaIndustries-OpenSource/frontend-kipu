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

  // New fields to achieve the sub-advances feature from your design rules
  weight?: number;
  isMiniAdvance: boolean;
  parentId?: number | null;
}

export type ProgressStatus = 'Active' | 'Finished' | 'Delayed';
