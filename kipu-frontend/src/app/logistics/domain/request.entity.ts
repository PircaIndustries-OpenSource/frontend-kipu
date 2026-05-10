export class RequestItem {
  supplierOfferId: string;
  quantity: number;
  constructor() {
    this.supplierOfferId = '';
    this.quantity = 0;
  }
}
export type RequestItemViewModel = RequestItem & {
  materialName: string;
  categoryName: string;
  materialUnit: string;
  materialSubcategory: string;
  pricePerUnit: number;
};
export class RequestEntity {
  id: string;
  projectId: string;
  requestDate: string;
  deadline: string;
  status: string;
  priority: number;
  deliveryLocation: string;
  budgetLineId: string;
  purpose: string;
  additionalNotes: string;
  suggestedSupplierId: string;
  attachments: string[];
  items: RequestItem[];
  requestedBy: string;
  activity: string;
  constructor() {
    this.id = '';
    this.projectId = '';
    this.requestDate = '';
    this.deadline = '';
    this.status = 'PENDING';
    this.priority = 0;
    this.deliveryLocation = '';
    this.budgetLineId = '';
    this.purpose = '';
    this.additionalNotes = '';
    this.suggestedSupplierId = '';
    this.attachments = [];
    this.items = [];
    this.requestedBy = '';
    this.activity = '';
  }
}
export type RequestViewModel = Omit<RequestEntity, 'items'> & {
  items: RequestItemViewModel[];
};
