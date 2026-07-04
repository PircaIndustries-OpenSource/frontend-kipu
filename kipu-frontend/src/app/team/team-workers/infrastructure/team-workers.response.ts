export type TeamWorkersResponse = TeamWorkersResource[];

export interface MachineryItemResource {
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
  machineries: MachineryItemResource[];
}

export interface CreateTeamWorkerRequest {
  dni: string;
  fullName: string;
  role: string;
  projectId: string;
  machineries: MachineryItemResource[];
}
