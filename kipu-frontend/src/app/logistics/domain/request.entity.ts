export class RequestItem {
  supplierOfferId: string;
  materialCatalogId: string;
  supplierId: string;
  quantity: number;
  unitPrice: number;
  constructor() {
    this.supplierOfferId = '';
    this.materialCatalogId = '';
    this.supplierId = '';
    this.quantity = 0;
    this.unitPrice = 0;
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
  budgetLineId: string | null;
  purpose: string;
  additionalNotes: string;
  suggestedSupplierId: string;
  attachments: string[];
  items: RequestItem[];
  requestedBy: string;
  activity: string | null;
  constructor() {
    this.id = '';
    this.projectId = '';
    this.requestDate = '';
    this.deadline = '';
    this.status = '';
    this.priority = '';
    this.deliveryLocation = '';
    this.budgetLineId = null;
    this.purpose = '';
    this.additionalNotes = '';
    this.suggestedSupplierId = '';
    this.attachments = [];
    this.items = [];
    this.requestedBy = '';
    this.activity = '';
  }
}
