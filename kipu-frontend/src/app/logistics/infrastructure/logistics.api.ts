import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {MaterialEntity} from '../domain/material.entity';
import {HttpClient} from '@angular/common/http';
import {MaterialsResponse} from './materials.response';
import {environment} from '../../../environments/environment.development';
import {MaterialsAssembler} from './materials.assembler';
import {RequestEntity} from '../domain/request.entity';
import {RequestResponse} from './request.response';
import {RequestAssembler} from './request.assembler';
import { MachineryEntity } from '../domain/machinery.entity';
import { MachineryResponse } from './machinery.response';
import { MachineryAssembler } from './machinery.assembler';
import { Supplier } from '../domain/supplier';
import { SupplierResponse } from './supplier-response';
import { SupplierAssembler } from './supplier.assembler';
import { WasteEntity } from '../domain/waste.entity';
import { WasteResponse } from './waste.response';
import { WasteAssembler } from './waste.assembler';

@Injectable({
  providedIn: 'root',
})
export class LogisticsApi {
  http = inject(HttpClient);
  apiBaseUrl = environment.kipuApiBaseUrl;
  materialsEndpoint = environment.kipuApiMaterialsEndpointPath;
  requestsEndpoint = environment.kipuApiRequestEndpointPath;
  machineryEndpoint = environment.kipuApiMachineryEndpointPath;
  suppliersEndpoint = environment.kipuApiSuppliersEndpointPath;
  wasteEndpoint = environment.kipuApiWasteEndpointPath;
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
  getAllSuppliers(): Observable<Supplier[]> {
    return this.http
      .get<SupplierResponse>(`${this.apiBaseUrl}${this.suppliersEndpoint}`)
      .pipe(map((response) => SupplierAssembler.toEntitiesFromResponse(response)));
  }
  getAllWaste(): Observable<WasteEntity[]> {
    return this.http
      .get<WasteResponse>(`${this.apiBaseUrl}${this.wasteEndpoint}`)
      .pipe(map((response) => WasteAssembler.toEntitiesFromResponse(response)));
  }
}
