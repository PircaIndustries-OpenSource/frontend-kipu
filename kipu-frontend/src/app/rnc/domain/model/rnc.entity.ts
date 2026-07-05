/**
 * Represents a Non-Conformance Result (RNC) in the construction project.
 * This entity encapsulates the quality incident data, including severity,
 * status tracking, and photographic evidence references.
 */

export interface SolutionLog {
  date: Date;
  note: string;
  author: string;
}

export interface RncEntity {
  id: string;
  projectId: string;
  title: string;
  description: string;
  specialty: 'Structures' | 'Facilities' | 'Architecture';
  location: string;
  severity: 'Critical' | 'Moderate' | 'Low';
  status: 'Created' | 'Assigned' | 'Solved' | 'Verified';
  reportedBy: string; // User ID
  reportDate: Date;
  images: string[];
  assignedTo?: string; // Optional: User ID assigned to resolve the RNC
  resolutionDate?: Date;
  solutionNotes: SolutionLog[];
}
