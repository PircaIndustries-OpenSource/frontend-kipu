import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HopperEntity } from '../../domain/hopper.entity';
import { HopperResource, HopperResponse } from '../models/hopper.response';
import { HopperAssembler } from '../assemblers/hopper.assembler';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HopperApiService {
  private httpClient = inject(HttpClient);

  private apiUrl = (environment as any).kipuApiBaseUrl || environment.kipuApiBaseUrl;
  private hopperEndpoint = environment.kipuApiHopperWatchEndpointPath;
  private hopperUrl = `${this.apiUrl}${this.hopperEndpoint}`;

  createHopperSensor(sensor: HopperEntity): Observable<HopperEntity> {
    const body = HopperAssembler.toResourceFromEntity(sensor);
    return this.httpClient
      .post<HopperResource>(this.hopperUrl, body)
      .pipe(map((response) => HopperAssembler.toEntityFromResource(response)));
  }

  getAllHopperSensors(): Observable<HopperEntity[]> {
    return this.httpClient
      .get<HopperResponse>(this.hopperUrl)
      .pipe(map((response) => HopperAssembler.toEntitiesFromResponse(response)));
  }

  updateHopperSensor(sensor: HopperEntity): Observable<HopperEntity> {
    const body = HopperAssembler.toResourceFromEntity(sensor);

    return this.httpClient
      .put<HopperResource>(`${this.hopperUrl}/${sensor.id}`, body)
      .pipe(map((response) => HopperAssembler.toEntityFromResource(response)));
  }

  deleteHopperSensor(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.hopperUrl}/${id}`);
  }
}
