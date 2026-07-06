import { SupplierOfferResource, SupplierOfferResponse } from './supplier-offer.response';
import { SupplierOfferEntity } from '../../domain/supplierOffer.entity';

export class SupplierOfferAssembler {
  static toEntityFromResource(resource: any): SupplierOfferEntity {
    return {
      id: String(resource.id),
      supplierId: String(resource.supplierId),
      materialId: String(resource.materialCatalogId ?? resource.materialId),
      unitPrice: resource.unitPrice,
    };
  }
  static toEntitiesFromResponse(response: SupplierOfferResponse): SupplierOfferEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }
}
