/**
 * Resource interface reflecting the RNC structure in the database/API.
 */
export interface RncResource {
  id: string;
  projectId: string;
  title: string;
  description: string;
  specialty: 'Structures' | 'Facilities' | 'Architecture';
  location: string;
  severity: 'Critical' | 'Moderate' | 'Low';
  status: 'Created' | 'Assigned' | 'Solved' | 'Verified';
  reportedBy: string;
  reportDate: string; // Dates are strings in JSON
  images: string[];
  assignedTo?: string;
  solutionNotes?: string;
  resolutionDate?: string;
}

export type RncResponse = RncResource[];
