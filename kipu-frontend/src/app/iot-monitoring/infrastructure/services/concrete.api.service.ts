import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConcreteEntity } from '../../domain/concrete.entity';
import { ConcreteAssembler } from '../assemblers/concrete.assembler';
import { ConcreteResource, ConcreteResponse } from '../models/concrete.response';

@Injectable({ providedIn: 'root' })
export class ConcreteApiService {
  private httpClient = inject(HttpClient);

  createConcreteSensor(sensor: ConcreteEntity): Observable<ConcreteEntity> {
    const body = ConcreteAssembler.toResourceFromEntity(sensor);
    return this.httpClient
      .post<ConcreteResource>(`http://localhost:3000/concreteCuring`, body)
      .pipe(map((response) => ConcreteAssembler.toEntityFromResource(response)));
  }

  updateConcreteSensor(sensor: ConcreteEntity): Observable<ConcreteEntity> {
    const body = ConcreteAssembler.toResourceFromEntity(sensor);

    return this.httpClient
      .put<ConcreteResource>(`http://localhost:3000/concreteCuring/${sensor.id}`, body)
      .pipe(map((response) => ConcreteAssembler.toEntityFromResource(response)));
  }

  deleteConcreteSensor(id: string): Observable<void> {
    return this.httpClient.delete<void>(`http://localhost:3000/concreteCuring/${id}`);
  }

  getAllConcreteSensors(): Observable<ConcreteEntity[]> {
    return this.httpClient
      .get<ConcreteResponse>(`http://localhost:3000/concreteCuring`)
      .pipe(map((response) => ConcreteAssembler.toEntitiesFromResponse(response)));
  }
}
