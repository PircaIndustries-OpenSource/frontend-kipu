import { SupplierResource, SupplierResponse } from './supplier-response';
import { Supplier } from '../domain/supplier';

export class SupplierAssembler {
  static toEntityFromResource(resource: SupplierResource): Supplier {
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
  static toEntitiesFromResponse(response: SupplierResponse): Supplier[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }
}
