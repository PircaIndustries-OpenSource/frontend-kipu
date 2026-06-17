import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InventoryMaterialEntity } from '../domain/inventoryMaterial.entity';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InventoryMaterialsResponse } from './inventory/inventoryMaterials.response';
import { environment } from '../../../environments/environment';
import { InventoryMaterialAssembler } from './inventory/inventoryMaterial.assembler';

@Injectable({
  providedIn: 'root',
})
export class LogisticsApi {
  http = inject(HttpClient);
  apiBaseUrl = environment.kipuApiBaseUrl;
  inventoryMaterialsEndpoint = environment.kipuApiInventoryMaterialsEndpointPath;
  // GET
  getAllInventoryMaterials(): Observable<InventoryMaterialEntity[]> {
    const projectId = localStorage.getItem('currentProjectId');
    const url = projectId
      ? `${this.apiBaseUrl}${this.inventoryMaterialsEndpoint}?projectId=${projectId}`
      : `${this.apiBaseUrl}${this.inventoryMaterialsEndpoint}`;
    return this.http
      .get<InventoryMaterialsResponse>(url)
      .pipe(map((response) => InventoryMaterialAssembler.toEntitiesFromResponse(response)));
  }
  getAllInventoryMaterialsByCategoryId(categoryId: number): Observable<InventoryMaterialEntity[]> {
    const projectId = localStorage.getItem('currentProjectId');
    const url = `${this.apiBaseUrl}${this.inventoryMaterialsEndpoint}`;
    let params = new HttpParams().set('categoryId', categoryId);
    if (projectId) {
      params = params.set('projectId', projectId);
    }
    return this.http
      .get<InventoryMaterialsResponse>(url, { params: params })
      .pipe(map((response) => InventoryMaterialAssembler.toEntitiesFromResponse(response)));
  }
  getAllInventoryMaterialsById(id: number): Observable<InventoryMaterialEntity[]> {
    const url = `${this.apiBaseUrl}${this.inventoryMaterialsEndpoint}/${id}`;
    return this.http
      .get<InventoryMaterialsResponse>(url)
      .pipe(map((response) => InventoryMaterialAssembler.toEntitiesFromResponse(response)));
  }
}
