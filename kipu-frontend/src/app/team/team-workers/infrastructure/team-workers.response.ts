export interface TeamWorkerMachineryResource {
  machineryId: string;
  fullName: string;
}

export interface TeamWorkersResource {
  id: string;
  dni: string;
  fullName: string;
  role: string;
  isActive: boolean;
  projectId: string;
  machineries: TeamWorkerMachineryResource[];
}

export type TeamWorkersResponse = TeamWorkersResource[];
