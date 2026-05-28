import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SeismicEntity } from '../../domain/seismic.entity';
import { map, Observable } from 'rxjs';
import { SeismicAssembler } from '../assemblers/seismic.assembler';
import { SeismicResource, SeismicResponse } from '../models/seismic.response';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SeismicApiService {
  private httpClient = inject(HttpClient);

  private apiUrl = environment.kipuApiBaseUrl;
  private seismicEndpoint = environment.kipuApiSeismicControlEndpointPath;
  private seismicUrl = `${this.apiUrl}${this.seismicEndpoint}`;

  createSeismicSensor(sensor: SeismicEntity): Observable<SeismicEntity> {
    const body = SeismicAssembler.toResourceFromEntity(sensor);
    return this.httpClient
      .post<SeismicResource>(this.seismicUrl, body)
      .pipe(map((response) => SeismicAssembler.toEntityFromResource(response)));
  }

  updateSeismicSensor(sensor: SeismicEntity): Observable<SeismicEntity> {
    const body = SeismicAssembler.toResourceFromEntity(sensor);

    return this.httpClient
      .put<SeismicResource>(`${this.seismicUrl}/${sensor.id}`, body)
      .pipe(map((response) => SeismicAssembler.toEntityFromResource(response)));
  }

  deleteSeismicSensor(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.seismicUrl}/${id}`);
  }

  getAllSeismicSensors(): Observable<SeismicEntity[]> {
    return this.httpClient
      .get<SeismicResponse>(this.seismicUrl)
      .pipe(map((response) => SeismicAssembler.toEntitiesFromResponse(response)));
  }
}
