export type MaterialsResponse = MaterialResource[];
export interface MaterialResource {
  id: string;
  name: string;
  categoryId: string;
  subcategory: string;
  measureUnit: string;
}
