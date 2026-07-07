import { RncEntity } from '../domain/model/rnc.entity';
import { RncResource } from './rnc.response';

function toPascalCase(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export class RncAssembler {
  static toEntityFromResource(resource: RncResource): RncEntity {
    return {
      id: resource.id,
      projectId: resource.projectId,
      title: resource.title,
      description: resource.description,
      specialty: toPascalCase(resource.specialty) as RncEntity['specialty'],
      location: resource.location,
      severity: toPascalCase(resource.severity) as RncEntity['severity'],
      status: toPascalCase(resource.status) as RncEntity['status'],
      reportedBy: resource.reportedBy,
      reportDate: new Date(resource.reportDate),
      images: resource.images || [],
      assignedTo: resource.assignedTo,
      solutionNotes: Array.isArray(resource.solutionNotes)
        ? resource.solutionNotes.map((s: any) => ({
            date: new Date(s.date || s.logDate),
            note: s.note || '',
            author: s.author || s.authorId || '',
          }))
        : [],
      resolutionDate: resource.resolutionDate ? new Date(resource.resolutionDate) : undefined,
    };
  }

  static toEntitiesFromResponse(resources: RncResource[]): RncEntity[] {
    return resources.map((resource) => this.toEntityFromResource(resource));
  }
}
