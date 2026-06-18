export type TeamUsersResponse = TeamUsersResource[];

export interface TeamUsersResource {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  role: string;
  projectId: string;
}
