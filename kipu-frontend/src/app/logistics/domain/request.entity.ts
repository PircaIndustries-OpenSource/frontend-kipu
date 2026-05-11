export class RequestItem {
  supplierOfferId: string;
  quantity: number;
  constructor() {
    this.supplierOfferId = '';
    this.quantity = 0;
  }
}
export class RequestEntity {
  id: string;
  projectId: string;
  requestDate: string;
  deadline: string;
  status: string;
  priority: string;
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
    this.status = '';
    this.priority = '';
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
