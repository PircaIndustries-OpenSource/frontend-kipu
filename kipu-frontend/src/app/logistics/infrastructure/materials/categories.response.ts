export type CategoriesResponse = CategoryResource[];

export interface CategoryResource {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}
