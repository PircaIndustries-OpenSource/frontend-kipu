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
  budgetLineId: string | null;
  purpose: string;
  additionalNotes: string;
  suggestedSupplierId: string;
  attachments: string[];
  items: RequestItem[];
  requestedBy: string;
  activity: string | null;
}
