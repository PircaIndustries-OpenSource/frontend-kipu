import { RequestItem } from '../../domain/request.entity';

export type RequestResponse = RequestResource[];
export interface RequestResource {
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
  items: RequestItemResource[];
  requestedBy: string;
  activity: string;
}

export interface RequestItemResource {
  materialCatalogId: number;
  supplierId: number;
  quantity: number;
  unitPrice: number;
}
