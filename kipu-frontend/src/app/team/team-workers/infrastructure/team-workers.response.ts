export type TeamWorkersResponse = TeamWorkersResource[];

export interface TeamWorkersResource {
  id: string,
  dni: string,
  fullName: string,
  role: string,
  status: string,
  assignedTools: string[]
}
