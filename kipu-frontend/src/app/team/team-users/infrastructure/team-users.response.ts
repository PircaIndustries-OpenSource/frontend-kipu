export type TeamUsersResponse = TeamUsersResource[];

export interface TeamUsersResource {
  id: string;
  userId: number;
  fullName: string;
  email: string,
  password: string,
  isActive: boolean,
  hasUnreadNotifications: boolean,
  role: string,
  projectId: string
}
