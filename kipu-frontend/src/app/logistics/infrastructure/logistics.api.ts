import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InventoryMaterialEntity } from '../domain/inventoryMaterial.entity';
import { HttpClient } from '@angular/common/http';
import { InventoryMaterialsResponse } from './inventory/inventoryMaterials.response';
import { environment } from '../../../environments/environment.development';
import { InventoryMaterialAssembler } from './inventory/inventoryMaterial.assembler';
import { RequestEntity } from '../domain/request.entity';
import { RequestResponse } from './request/request.response';
import { RequestAssembler } from './request/request.assembler';
import { MachineryEntity } from '../domain/machinery.entity';
import { MachineryResponse } from './machinery/machinery.response';
import { MachineryAssembler } from './machinery/machinery.assembler';
import { SupplierEntity } from '../domain/supplier.entity';
import { SupplierResponse } from './suppliers/supplier-response';
import { SupplierAssembler } from './suppliers/supplier.assembler';
import { WasteEntity } from '../domain/waste.entity';
import { WasteResponse } from './waste/waste.response';
import { WasteAssembler } from './waste/waste.assembler';
import { MaterialEntity } from '../domain/material.entity';
import { MaterialsAssembler } from './materials/materials.assembler';
import { MaterialsResponse } from './materials/materials.response';
import { CategoryEntity } from '../domain/category.entity';
import { CategoriesResponse } from './materials/categories.response';
import { CategoriesAssembler } from './materials/categories.assembler';
import { SupplierOfferEntity } from '../domain/supplierOffer.entity';
import { SupplierOfferResponse } from './suppliers/supplier-offer.response';
import { SupplierOfferAssembler } from './suppliers/supplier-offer.assembler';

@Injectable({
  providedIn: 'root',
})
export class LogisticsApi {
  http = inject(HttpClient);
  apiBaseUrl = environment.kipuApiBaseUrl;
  inventoryMaterialsEndpoint = environment.kipuApiInventoryMaterialsEndpointPath;
  materialsEndpoint = environment.kipuApiMaterialsEndpointPath;
  requestsEndpoint = environment.kipuApiRequestEndpointPath;
  machineryEndpoint = environment.kipuApiMachineryEndpointPath;
  suppliersEndpoint = environment.kipuApiSuppliersEndpointPath;
  wasteEndpoint = environment.kipuApiWasteEndpointPath;
  categoriesEndpoint = environment.kipuApiCategoriesEndPath;
  supplierOfferEndpoint = environment.kipuApiSupplierOfferEndPath;
  // GET
  getAllInventoryMaterials(): Observable<InventoryMaterialEntity[]> {
    return this.http
      .get<InventoryMaterialsResponse>(`${this.apiBaseUrl}${this.inventoryMaterialsEndpoint}`)
      .pipe(map((response) => InventoryMaterialAssembler.toEntitiesFromResponse(response)));
  }
  getAllMaterials(): Observable<MaterialEntity[]> {
    return this.http
      .get<MaterialsResponse>(`${this.apiBaseUrl}${this.materialsEndpoint}`)
      .pipe(map((response) => MaterialsAssembler.toEntitiesFromResponse(response)));
  }
  getAllRequest(): Observable<RequestEntity[]> {
    return this.http
      .get<RequestResponse>(`${this.apiBaseUrl}${this.requestsEndpoint}`)
      .pipe(map((response) => RequestAssembler.toEntitiesFromResponse(response)));
  }
  getAllMachinery(): Observable<MachineryEntity[]> {
    return this.http
      .get<MachineryResponse>(`${this.apiBaseUrl}${this.machineryEndpoint}`)
      .pipe(map((response) => MachineryAssembler.toEntitiesFromResponse(response)));
  }
  getAllSuppliers(): Observable<SupplierEntity[]> {
    return this.http
      .get<SupplierResponse>(`${this.apiBaseUrl}${this.suppliersEndpoint}`)
      .pipe(map((response) => SupplierAssembler.toEntitiesFromResponse(response)));
  }
  getAllWaste(): Observable<WasteEntity[]> {
    return this.http
      .get<WasteResponse>(`${this.apiBaseUrl}${this.wasteEndpoint}`)
      .pipe(map((response) => WasteAssembler.toEntitiesFromResponse(response)));
  }
  getAllCategories(): Observable<CategoryEntity[]> {
    return this.http
      .get<CategoriesResponse>(`${this.apiBaseUrl}${this.categoriesEndpoint}`)
      .pipe(map((response) => CategoriesAssembler.toEntitiesFromResponse(response)));
  }
  getAllSupplierOffer(): Observable<SupplierOfferEntity[]> {
    return this.http
      .get<SupplierOfferResponse>(`${this.apiBaseUrl}${this.supplierOfferEndpoint}`)
      .pipe(map((response) => SupplierOfferAssembler.toEntitiesFromResponse(response)));
  }
  //POST
  postRequest(request: RequestEntity): Observable<RequestEntity> {
    return this.http
      .post<RequestEntity>(`${this.apiBaseUrl}${this.requestsEndpoint}`, request)
      .pipe(map((response) => RequestAssembler.toEntityFromResource(response)));
  }
}
