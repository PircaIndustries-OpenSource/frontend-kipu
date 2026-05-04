import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MaterialEntity } from '../domain/material.entity';
import { HttpClient } from '@angular/common/http';
import { MaterialsResponse } from './materials.response';
import { environment } from '../../../environments/environment.development';
import { MaterialsAssembler } from './materials.assembler';

@Injectable({
  providedIn: 'root',
})
export class LogisticsApi {
  http = inject(HttpClient);
  apiBaseUrl = environment.kipuApiBaseUrl;
  materialsEndpoint = environment.kipuApiMaterialsEndpointPath;
  getAllMaterials(): Observable<MaterialEntity[]> {
    return this.http
      .get<MaterialsResponse>(`${this.apiBaseUrl}${this.materialsEndpoint}`)
      .pipe(map((response) => MaterialsAssembler.toEntitiesFromResponse(response)));
  }
}
