export type ProjectsResponse = ProjectResource[];

export interface ProjectResource {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate?: string;
  totalBudget?: number;
  location: string;
  createdAt: string;
  createdBy: string;
  statusJustification?: string;
  imageUrl?: string;
  progress?: number;
}
