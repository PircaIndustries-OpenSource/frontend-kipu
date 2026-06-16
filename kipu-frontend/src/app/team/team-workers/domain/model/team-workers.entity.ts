export interface TeamWorkerMachinery {
  machineryId: string;
  fullName: string;
}

export class TeamWorkersEntity {
  id: string = '';
  dni: string = '';
  fullName: string = '';
  role: string = '';
  isActive: boolean = true;
  projectId: string = '';
  machineries: TeamWorkerMachinery[] = [];
}
