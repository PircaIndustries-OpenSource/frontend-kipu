export type ConcreteResponse = ConcreteResource[];
export interface ConcreteResource {
  id: string;
  projectId: string;
  name: string;
  state: number;
  location: string;
  temperature: number;
  humidity: number;
  limit: number;
  unit: string;
}
