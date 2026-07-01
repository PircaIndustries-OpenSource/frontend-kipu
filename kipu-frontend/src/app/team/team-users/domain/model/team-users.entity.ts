export class TeamUsersEntity {
  id: string;
  userId: number;
  fullName: string;
  email: string;
  isActive: boolean;
  role: string;
  constructor() {
    this.id = "";
    this.userId = 0;
    this.fullName = "";
    this.email = "";
    this.isActive = true;
    this.role = "";
  }
}
