export interface WorkerMachinery {
  machineryId: string;
  fullName: string;
}

export class TeamWorkersEntity {
  id: string;
  dni: string;
  fullName: string;
  role: string;
  isActive: boolean;
  projectId: string;
  machineries: WorkerMachinery[];

  constructor() {
    this.id = '';
    this.dni = '';
    this.fullName = '';
    this.role = '';
    this.isActive = true;
    this.projectId = '';
    this.machineries = [];
  }

  get assignedTools(): string[] {
    return this.machineries.map((m) => m.fullName);
  }
}
