import { MaterialRequestItemResource } from './request.item.resource';

export type RequestResponse = RequestResource[];
export interface RequestResource {
  id: string;
  deadline: string;
  requestStatus: string;
  requestPriority: string;
  deliveryLocation: string;
  budgetLineId: number | null;
  purpose: string;
  additionalNotes: string;
  requestedBy: number;
  items: MaterialRequestItemResource[];
}
