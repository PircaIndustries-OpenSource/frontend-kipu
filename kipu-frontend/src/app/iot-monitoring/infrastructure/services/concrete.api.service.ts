import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConcreteEntity } from '../../domain/concrete.entity';
import { ConcreteAssembler } from '../assemblers/concrete.assembler';
import { ConcreteResource, ConcreteResponse } from '../models/concrete.response';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConcreteApiService {
  private httpClient = inject(HttpClient);

  private apiUrl = (environment as any).kipuApiBaseUrl || environment.kipuApiBaseUrl;
  private concreteEndpoint = environment.kipuApiConcreteCuringEndpointPath;
  private concreteUrl = `${this.apiUrl}${this.concreteEndpoint}`;

  createConcreteSensor(sensor: ConcreteEntity): Observable<ConcreteEntity> {
    const body = ConcreteAssembler.toResourceFromEntity(sensor);
    return this.httpClient
      .post<ConcreteResource>(this.concreteUrl, body)
      .pipe(map((response) => ConcreteAssembler.toEntityFromResource(response)));
  }

  updateConcreteSensor(sensor: ConcreteEntity): Observable<ConcreteEntity> {
    const body = ConcreteAssembler.toResourceFromEntity(sensor);

    return this.httpClient
      .put<ConcreteResource>(`${this.concreteUrl}/${sensor.id}`, body)
      .pipe(map((response) => ConcreteAssembler.toEntityFromResource(response)));
  }

  deleteConcreteSensor(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.concreteUrl}/${id}`);
  }

  getAllConcreteSensors(): Observable<ConcreteEntity[]> {
    return this.httpClient
      .get<ConcreteResponse>(this.concreteUrl)
      .pipe(map((response) => ConcreteAssembler.toEntitiesFromResponse(response)));
  }
}
