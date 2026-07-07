export type HopperResponse = HopperResource[];
export interface HopperResource {
  id: string;
  projectId: string;
  sensorId: string;
  unit: string;
  state: number;
  lastLecture: number;
  limit?: number;
  safetyLimit?: number;
  name: string;
}
