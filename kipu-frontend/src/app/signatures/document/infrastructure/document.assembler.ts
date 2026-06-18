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

    entity.assignedTo = resource.signers
      ? resource.signers.map((signer) => this.toUserDocumentEntity(signer))
      : [];

    return entity;
  }

  static toEntitiesFromResponse(response: DocumentResponse): DocumentEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  private static toUserDocumentEntity(resource: SignerResource): UserDocument {
    return {
      id: resource.teamUserId,
      fullName: resource.fullName,
    };
  }
}
