export class TeamWorkersEntity {
  dni: string;
  fullName: string;
  role: string;
  status: string;
  assignedTools: string[];
  constructor() {
    this.dni = "";
    this.fullName = "";
    this.role = "";
    this.status = "";
    this.assignedTools = [];
  }
}
