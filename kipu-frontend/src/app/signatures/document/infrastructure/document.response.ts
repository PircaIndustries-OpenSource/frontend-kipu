export interface DocumentResource {
  id: string;
  type: string;
  isSigned: boolean;
  digitalSignatureToken: string | null;
  deadLine: string;
  projectId: string;
  signers: SignerResource[];
}

export interface SignerResource {
  teamUserId: string;
  fullName: string;
}

export type DocumentResponse = DocumentResource[];
