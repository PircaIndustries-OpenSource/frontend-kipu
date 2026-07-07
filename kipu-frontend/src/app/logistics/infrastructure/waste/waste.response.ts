export type WasteResponse = WasteResource[];

export interface WasteResource {
  id: string;
  projectId: string;
  materialCatalogId: number;
  quantity: number;
  unit: string;
  classificationType: string;
  date: string;
  description: string;
  reportedBy: string;
  photoUrl: string;
}
