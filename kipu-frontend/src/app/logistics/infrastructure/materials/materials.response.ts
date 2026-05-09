export type MaterialsResponse = MaterialResource[];
export interface MaterialResource {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  measureUnit: string;
}
