export class TeamWorkersEntity {
  id: string;
  dni: string;
  fullName: string;
  role: string;
  status: string;
  assignedTools: string[];
  constructor() {
    this.id = "";
    this.dni = "";
    this.fullName = "";
    this.role = "";
    this.status = "";
    this.assignedTools = [];
  }
}
