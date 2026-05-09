export class TeamUsersEntity {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  role: string;
  constructor() {
    this.id = "";
    this.fullName = "";
    this.email = "";
    this.isActive = true;
    this.role = "";
  }
}
