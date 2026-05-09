export class RequestItem {
  materialId: string;
  quantity: number;
  pricePerUnit: number;
  constructor() {
    this.materialId = '';
    this.quantity = 0;
    this.pricePerUnit = 0;
  }
}
export type RequestItemViewModel = RequestItem & {
  materialName: string;
  materialCategory: string;
  materialUnit: string;
  materialSubcategory: string;
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
    this.id = "";
    this.projectId = "";
    this.requestDate = "";
    this.deadline = "";
    this.status = "PENDING";
    this.priority = 0;
    this.deliveryLocation = "";
    this.budgetLineId = "";
    this.purpose = "";
    this.additionalNotes = "";
    this.suggestedSupplierId = "";
    this.attachments = [];
    this.items = [];
    this.requestedBy = "";
    this.activity = "";
  }
}
export type RequestViewModel = Omit<RequestEntity, 'items'> & {
  items: RequestItemViewModel[];
};
