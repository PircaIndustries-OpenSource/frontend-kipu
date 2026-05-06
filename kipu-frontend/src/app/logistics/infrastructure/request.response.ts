import {RequestItem} from '../domain/request.entity';

export type RequestResponse = RequestResource[];
export interface RequestResource {
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
}
