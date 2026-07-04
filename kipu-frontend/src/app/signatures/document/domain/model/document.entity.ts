export interface UserDocument {
  id: string;
  fullName: string;
  signedAt?: Date;
}

export class DocumentEntity {
  id: string;
  type: string;
  isSigned: boolean;
  digitalSignatureToken: string | null;
  deadLine: Date;
  projectId: string;
  assignedTo: UserDocument[];

  constructor() {
    this.id = '';
    this.type = '';
    this.isSigned = false;
    this.digitalSignatureToken = null;
    this.deadLine = new Date();
    this.projectId = '';
    this.assignedTo = [];
  }
}
