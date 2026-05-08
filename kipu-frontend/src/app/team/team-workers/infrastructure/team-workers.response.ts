export type TeamWorkersResponse = TeamWorkersResource[];

export interface TeamWorkersResource {
  dni: string,
  fullName: string,
  role: string,
  status: string,
  assignedTools: string[]
}
