import { SupplierResource, SupplierResponse } from './supplier-response';
import { SupplierEntity } from '../../domain/supplier.entity';

export class SupplierAssembler {
  static toEntityFromResource(resource: SupplierResource): SupplierEntity {
    return {
      id: String(resource.id),
      ruc: resource.ruc,
      onboarded: '',
      socialReason: resource.socialReason,
      contact: resource.contact ?? '',
      phone: resource.phone,
      email: resource.email,
      categories: '',
      paymentTerms: resource.paymentTerms ?? '',
      status: resource.isActive ? 'ACTIVE' : 'INACTIVE',
    };
  }
  static toEntitiesFromResponse(response: SupplierResponse): SupplierEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }
  static toBackendPatch(entity: Partial<SupplierEntity>): Record<string, unknown> {
    const patch: Record<string, unknown> = {};
    if (entity.socialReason !== undefined) patch['socialReason'] = entity.socialReason;
    if (entity.contact !== undefined) patch['contact'] = entity.contact;
    if (entity.phone !== undefined) patch['phone'] = entity.phone;
    if (entity.email !== undefined) patch['email'] = entity.email;
    if (entity.paymentTerms !== undefined) patch['paymentTerms'] = entity.paymentTerms;
    if (entity.status !== undefined) patch['isActive'] = entity.status === 'ACTIVE';
    return patch;
  }
  static toBackendCreate(entity: Partial<SupplierEntity>): Record<string, unknown> {
    return {
      ruc: entity.ruc,
      socialReason: entity.socialReason,
      contact: entity.contact,
      phone: entity.phone,
      email: entity.email,
      paymentTerms: entity.paymentTerms ?? null,
      isActive: entity.status !== 'INACTIVE',
    };
  }
}
