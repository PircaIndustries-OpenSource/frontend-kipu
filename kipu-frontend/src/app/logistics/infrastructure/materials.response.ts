export type MaterialsResponse = MaterialResource[];

export interface MaterialResource {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  currentStock: number;
  measureUnit: string;
  minimumLimit: number;
  status: string;
  suggestedSupplierId: string;
}
