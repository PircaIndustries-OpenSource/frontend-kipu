export type MaterialsResponse = MaterialResource[];
export interface MaterialResource {
  id: string;
  name: string;
  categoryId: string;
  measureUnit: string;
}
