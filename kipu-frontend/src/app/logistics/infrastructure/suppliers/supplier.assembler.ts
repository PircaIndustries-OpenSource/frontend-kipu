import { SupplierResource, SupplierResponse } from './supplier-response';
import { SupplierEntity } from '../../domain/supplier.entity';

export class SupplierAssembler {
  static toEntityFromResource(resource: SupplierResource): SupplierEntity {
    return {
      id: resource.id,
      ruc: resource.ruc,
      onboarded: resource.onboarded,
      socialReason: resource.socialReason,
      contact: resource.contact,
      phone: resource.phone,
      email: resource.email,
      categories: resource.categories,
      paymentTerms: resource.paymentTerms,
      status: resource.status,
    };
  }
  static toEntitiesFromResponse(response: SupplierResponse): SupplierEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }
}
