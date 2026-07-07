import { RequestItem } from '../../domain/request.entity';

export type RequestResponse = RequestResource[];
export interface RequestResource {
  id: string;
  projectId?: string;
  deadline: string;
  requestStatus?: string;
  status?: string;
  requestPriority?: string;
  priority?: string;
  deliveryLocation: string;
  budgetLineId: string | number;
  purpose: string;
  additionalNotes: string;
  suggestedSupplierId: string | number;
  items: RequestItemResource[];
  requestedBy: string | number;
  createdAt?: string;
}

export interface RequestItemResource {
  materialCatalogId: number;
  supplierId: number;
  quantity: number;
  unitPrice: number;
}
