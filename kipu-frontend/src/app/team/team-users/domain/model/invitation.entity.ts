export interface InvitationEntity {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status?: string;
  projectId: string;
}
