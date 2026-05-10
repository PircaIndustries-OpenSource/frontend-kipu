import { SupplierOfferResource, SupplierOfferResponse } from './supplier-offer.response';
import { SupplierOfferEntity } from '../../domain/supplierOffer.entity';

export class SupplierOfferAssembler {
  static toEntityFromResource(resource: SupplierOfferResource): SupplierOfferEntity {
    return {
      id: resource.id,
      supplierId: resource.supplierId,
      materialId: resource.materialId,
      unitPrice: resource.unitPrice,
    };
  }
  static toEntitiesFromResponse(response: SupplierOfferResponse): SupplierOfferEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }
}
