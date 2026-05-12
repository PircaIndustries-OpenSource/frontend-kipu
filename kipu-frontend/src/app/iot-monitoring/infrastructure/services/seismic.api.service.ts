import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SeismicEntity } from '../../domain/seismic.entity';
import { map, Observable } from 'rxjs';
import { SeismicAssembler } from '../assemblers/seismic.assembler';
import { SeismicResource, SeismicResponse } from '../models/seismic.response';

@Injectable({ providedIn: 'root' })
export class SeismicApiService {
  private httpClient = inject(HttpClient);

  createSeismicSensor(sensor: SeismicEntity): Observable<SeismicEntity> {
    const body = SeismicAssembler.toResourceFromEntity(sensor);
    return this.httpClient
      .post<SeismicResource>(`http://localhost:3000/seismic-control`, body)
      .pipe(map((response) => SeismicAssembler.toEntityFromResource(response)));
  }

  updateSeismicSensor(sensor: SeismicEntity): Observable<SeismicEntity> {
    const body = SeismicAssembler.toResourceFromEntity(sensor);

    return this.httpClient
      .put<SeismicResource>(`http://localhost:3000/seismic-control/${sensor.id}`, body)
      .pipe(map((response) => SeismicAssembler.toEntityFromResource(response)));
  }

  deleteSeismicSensor(id: string): Observable<void> {
    return this.httpClient.delete<void>(`http://localhost:3000/seismic-control/${id}`);
  }

  getAllSeismicSensors(): Observable<SeismicEntity[]> {
    return this.httpClient
      .get<SeismicResponse>(`http://localhost:3000/seismic-control`)
      .pipe(map((response) => SeismicAssembler.toEntitiesFromResponse(response)));
  }
}
