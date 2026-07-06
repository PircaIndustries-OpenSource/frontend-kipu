import { DocumentResource, DocumentResponse, SignerResource } from './document.response';
import { DocumentEntity, UserDocument } from '../domain/model/document.entity';

export class DocumentAssembler {
  static toEntityFromResource(resource: DocumentResource): DocumentEntity {
    const entity = new DocumentEntity();
    entity.id = resource.id;
    entity.type = resource.type;
    entity.isSigned = resource.isSigned;
    entity.digitalSignatureToken = resource.digitalSignatureToken;
    entity.deadLine = new Date(resource.deadLine);
    entity.projectId = resource.projectId;
    entity.assignedTo = (resource.signers || []).map((s) => this.toUserDocument(s));
    return entity;
  }

  static toResourceFromEntity(entity: DocumentEntity): Record<string, unknown> {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const d = entity.deadLine;
    const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    return {
      type: entity.type,
      deadLine: localIso,
      projectId: entity.projectId,
      signers: entity.assignedTo.map((u) => ({
        teamUserId: u.id,
        fullName: u.fullName,
        signedAt: u.signedAt ? u.signedAt.toISOString() : null,
      })),
    };
  }

  static toEntitiesFromResponse(response: DocumentResponse): DocumentEntity[] {
    return response.map((r) => this.toEntityFromResource(r));
  }

  private static toUserDocument(signer: SignerResource): UserDocument {
    return {
      id: signer.teamUserId,
      fullName: signer.fullName,
      signedAt: signer.signedAt ? new Date(signer.signedAt) : undefined,
    };
  }
}
