export class TeamUsersEntity {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  role: string;
  projectId: string;
  constructor() {
    this.id = "";
    this.fullName = "";
    this.email = "";
    this.isActive = true;
    this.role = "";
    this.projectId = "";
  }
}
