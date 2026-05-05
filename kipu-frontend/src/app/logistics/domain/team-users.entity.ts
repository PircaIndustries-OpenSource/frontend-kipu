export class TeamUsersEntity {
  id: string;
  fullName: string;
  email: string;
  password: string;
  isActive: boolean;
  hasUnreadNotifications: boolean;
  role: string;
  constructor() {
    this.id = "";
    this.fullName = "";
    this.email = "";
    this.password = "";
    this.isActive = true;
    this.hasUnreadNotifications = false;
    this.role = "";
  }
}
