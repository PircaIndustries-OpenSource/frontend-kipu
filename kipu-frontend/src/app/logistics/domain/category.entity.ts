export class CategoryEntity {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  constructor() {
    this.id = '';
    this.name = '';
    this.description = '';
    this.isActive = false;
  }
}
