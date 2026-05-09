
export interface DocumentResource {
  id: string;
  type: string;
  isSigned: boolean;
  digitalSignatureToken: string | null;
  deadLine: string | Date;
  assignedTo: UserDocumentResource[];
}

export interface UserDocumentResource {
  id: string;
  fullName: string;
  signedAt?: string | Date;
}

export type DocumentResponse = DocumentResource[];
