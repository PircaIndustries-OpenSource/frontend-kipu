export class TeamUsersEntity {
  id: string;
  userId: number;
  fullName: string;
  email: string;
  isActive: boolean;
  role: string;
  projectId: string;
  constructor() {
    this.id = "";
    this.userId = 0;
    this.fullName = "";
    this.email = "";
    this.isActive = true;
    this.role = "";
    this.projectId = "";
  }
}
