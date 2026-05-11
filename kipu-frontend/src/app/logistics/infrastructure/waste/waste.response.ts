export type WasteResponse = WasteResource[];

export interface WasteResource {
  id: string;
  projectId: string;
  materialId: string;
  quantity: number;
  date: string;
  description: string;
  reportedBy: string;
  photoUrl: string;
}
