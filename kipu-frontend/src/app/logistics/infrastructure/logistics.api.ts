import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InventoryMaterialEntity } from '../domain/inventoryMaterial.entity';
import { HttpClient } from '@angular/common/http';
import { InventoryMaterialsResponse } from './inventory/inventoryMaterials.response';
import { environment } from '../../../environments/environment';
import { InventoryMaterialAssembler } from './inventory/inventoryMaterial.assembler';
import { RequestEntity } from '../domain/request.entity';
import { RequestResponse, RequestResource } from './request/request.response';
import { RequestAssembler } from './request/request.assembler';
import { MachineryEntity } from '../domain/machinery.entity';
import { MachineryResponse, MachineryResource } from './machinery/machinery.response';
import { MachineryAssembler } from './machinery/machinery.assembler';
import { SupplierEntity } from '../domain/supplier.entity';
import { SupplierResponse, SupplierResource } from './suppliers/supplier-response';
import { SupplierAssembler } from './suppliers/supplier.assembler';
import { WasteEntity } from '../domain/waste.entity';
import { WasteResponse, WasteResource } from './waste/waste.response';
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
    const projectId = localStorage.getItem('currentProjectId');
    const url = projectId ? `${this.apiBaseUrl}${this.inventoryMaterialsEndpoint}?projectId=${projectId}` : `${this.apiBaseUrl}${this.inventoryMaterialsEndpoint}`;
    return this.http
      .get<InventoryMaterialsResponse>(url)
      .pipe(map((response) => InventoryMaterialAssembler.toEntitiesFromResponse(response)));
  }
  getAllMaterials(): Observable<MaterialEntity[]> {
    return this.http
      .get<MaterialsResponse>(`${this.apiBaseUrl}${this.materialsEndpoint}`)
      .pipe(map((response) => MaterialsAssembler.toEntitiesFromResponse(response)));
  }
  getAllRequest(): Observable<RequestEntity[]> {
    const projectId = localStorage.getItem('currentProjectId');
    const url = projectId ? `${this.apiBaseUrl}${this.requestsEndpoint}?projectId=${projectId}` : `${this.apiBaseUrl}${this.requestsEndpoint}`;
    return this.http
      .get<RequestResponse>(url)
      .pipe(map((response) => RequestAssembler.toEntitiesFromResponse(response)));
  }
  getAllMachinery(): Observable<MachineryEntity[]> {
    const projectId = localStorage.getItem('currentProjectId');
    const url = projectId ? `${this.apiBaseUrl}${this.machineryEndpoint}?projectId=${projectId}` : `${this.apiBaseUrl}${this.machineryEndpoint}`;
    return this.http
      .get<MachineryResponse>(url)
      .pipe(map((response) => MachineryAssembler.toEntitiesFromResponse(response)));
  }
  getAllSuppliers(): Observable<SupplierEntity[]> {
    return this.http
      .get<SupplierResponse>(`${this.apiBaseUrl}${this.suppliersEndpoint}`)
      .pipe(map((response) => SupplierAssembler.toEntitiesFromResponse(response)));
  }
  getAllWaste(): Observable<WasteEntity[]> {
    const projectId = localStorage.getItem('currentProjectId');
    const url = projectId ? `${this.apiBaseUrl}${this.wasteEndpoint}?projectId=${projectId}` : `${this.apiBaseUrl}${this.wasteEndpoint}`;
    return this.http
      .get<WasteResponse>(url)
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
      .post<RequestResource>(`${this.apiBaseUrl}${this.requestsEndpoint}`, request)
      .pipe(map((response) => RequestAssembler.toEntityFromResource(response)));
  }
  postMachinery(machinery: MachineryEntity): Observable<MachineryEntity> {
    return this.http
      .post<MachineryResource>(`${this.apiBaseUrl}${this.machineryEndpoint}`, machinery)
      .pipe(map((response) => MachineryAssembler.toEntityFromResource(response)));
  }
  postWaste(waste: WasteEntity): Observable<WasteEntity> {
    return this.http
      .post<WasteResource>(`${this.apiBaseUrl}${this.wasteEndpoint}`, waste)
      .pipe(map((response) => WasteAssembler.toEntityFromResource(response)));
  }
  postSupplier(supplier: SupplierEntity): Observable<SupplierEntity> {
    return this.http
      .post<SupplierResource>(`${this.apiBaseUrl}${this.suppliersEndpoint}`, supplier)
      .pipe(map((response) => SupplierAssembler.toEntityFromResource(response)));
  }
  //PATCH
  patchRequest(id: string, updates: Partial<RequestEntity>): Observable<RequestEntity> {
    return this.http
      .patch<RequestResource>(`${this.apiBaseUrl}${this.requestsEndpoint}/${id}`, updates)
      .pipe(map((response) => RequestAssembler.toEntityFromResource(response)));
  }
  patchMachinery(id: string, updates: Partial<MachineryEntity>): Observable<MachineryEntity> {
    return this.http
      .patch<MachineryResource>(`${this.apiBaseUrl}${this.machineryEndpoint}/${id}`, updates)
      .pipe(map((response) => MachineryAssembler.toEntityFromResource(response)));
  }
  patchSupplier(id: string, updates: Partial<SupplierEntity>): Observable<SupplierEntity> {
    return this.http
      .patch<SupplierResource>(`${this.apiBaseUrl}${this.suppliersEndpoint}/${id}`, updates)
      .pipe(map((response) => SupplierAssembler.toEntityFromResource(response)));
  }
  //DELETE
  deleteSupplier(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}${this.suppliersEndpoint}/${id}`);
  }
}
