import { RncEntity } from '../domain/model/rnc.entity';
import { RncResource } from './rnc.response';

/**
 * Assembler class to transform API resources into Domain entities.
 */
export class RncAssembler {
  static toEntityFromResource(resource: RncResource): RncEntity {
    return {
      id: resource.id,
      projectId: resource.projectId,
      title: resource.title,
      description: resource.description,
      specialty: resource.specialty,
      location: resource.location,
      severity: resource.severity,
      status: resource.status,
      reportedBy: resource.reportedBy,
      reportDate: new Date(resource.reportDate),
      images: resource.images,
      assignedTo: resource.assignedTo,
      solutionNotes: Array.isArray(resource.solutionNotes)
        ? resource.solutionNotes
        : resource.solutionNotes
          ? [{ date: new Date(), note: resource.solutionNotes, author: 'System' }]
          : [],
      resolutionDate: resource.resolutionDate ? new Date(resource.resolutionDate) : undefined,
    };
  }

  static toEntitiesFromResponse(resources: RncResource[]): RncEntity[] {
    return resources.map((resource) => this.toEntityFromResource(resource));
  }
}
