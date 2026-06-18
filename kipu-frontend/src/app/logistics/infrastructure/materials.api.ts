import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MaterialEntity } from '../domain/material.entity';
import { MaterialsAssembler } from './materials/materials.assembler';
import { MaterialResource, MaterialsResponse } from './materials/materials.response';

@Injectable({
  providedIn: 'root',
})
export class MaterialsApi {
  http = inject(HttpClient);
  apiBaseUrl = (environment as any).kipuApiHostLocal || environment.kipuApiBaseUrl;
  materialsEndpoint = environment.kipuApiMaterialsEndpointPath;
  getAllMaterials(): Observable<MaterialEntity[]> {
    return this.http
      .get<MaterialsResponse>(`${this.apiBaseUrl}${this.materialsEndpoint}`)
      .pipe(map((response) => MaterialsAssembler.toEntitiesFromResponse(response)));
  }
  postMaterial(material: MaterialEntity): Observable<MaterialEntity> {
    return this.http
      .post<MaterialResource>(`${this.apiBaseUrl}${this.materialsEndpoint}`, material)
      .pipe(map((response) => MaterialsAssembler.toEntityFromResource(response)));
  }
}
