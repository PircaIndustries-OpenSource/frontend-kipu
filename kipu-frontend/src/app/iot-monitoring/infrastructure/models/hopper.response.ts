export type HopperResponse = HopperResource[];
export interface HopperResource {
  id: string;
  projectId: string;
  unit: string;
  state: number;
  lastLecture: number;
  limit: number;
  name: string;
}
