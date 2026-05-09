
import { DocumentResource, DocumentResponse, UserDocumentResource } from './document.response';
import { DocumentEntity, UserDocument } from '../domain/model/document.entity';

export class DocumentAssembler {
  static toEntityFromResource(resource: DocumentResource): DocumentEntity {
    const entity = new DocumentEntity();
    entity.id = resource.id;
    entity.type = resource.type;
    entity.isSigned = resource.isSigned;
    entity.digitalSignatureToken = resource.digitalSignatureToken;
    entity.deadLine = new Date(resource.deadLine);
    entity.assignedTo = resource.assignedTo.map((user) => this.toUserDocumentEntity(user));
    return entity;
  }

  static toResourceFromEntity(entity: DocumentEntity): DocumentResource {
    return {
      id: entity.id,
      type: entity.type,
      isSigned: entity.isSigned,
      digitalSignatureToken: entity.digitalSignatureToken,
      deadLine: entity.deadLine.toISOString(),
      assignedTo: entity.assignedTo.map((user) => this.toUserDocumentResource(user)),
    };
  }

  static toEntitiesFromResponse(response: DocumentResponse): DocumentEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  static toResponseFromEntities(entities: DocumentEntity[]): DocumentResponse {
    return entities.map((entity) => this.toResourceFromEntity(entity));
  }

  private static toUserDocumentEntity(resource: UserDocumentResource): UserDocument {
    return {
      id: resource.id,
      fullName: resource.fullName,
      signedAt: resource.signedAt ? new Date(resource.signedAt) : undefined,
    };
  }

  private static toUserDocumentResource(entity: UserDocument): UserDocumentResource {
    return {
      id: entity.id,
      fullName: entity.fullName,
      signedAt: entity.signedAt?.toISOString(),
    };
  }
}
