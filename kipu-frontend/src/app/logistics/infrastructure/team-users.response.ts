export type TeamUsersResponse = TeamUsersResource[];

export interface TeamUsersResource {
  id: string;
  fullName: string;
  email: string,
  password: string,
  isActive: boolean,
  hasUnreadNotifications: boolean,
  role: string
}
