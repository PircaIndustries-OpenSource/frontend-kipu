import { Supplier } from './supplier';

export class RequestItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  constructor() {
    this.materialId = '';
    this.materialName = '';
    this.quantity = 0;
    this.unit = '';
    this.pricePerUnit = 0;
  }
}

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
  item: RequestItem;
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
    this.item = new RequestItem();
    this.requestedBy = "";
    this.activity = "";
  }
}
