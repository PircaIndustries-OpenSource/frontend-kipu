export interface SignerResource {
  teamUserId: string;
  fullName: string;
  signedAt: string | null;
}

export interface DocumentResource {
  id: string;
  type: string;
  isSigned: boolean;
  digitalSignatureToken: string | null;
  deadLine: string;
  projectId: string;
  signers: SignerResource[];
}

export type DocumentResponse = DocumentResource[];
