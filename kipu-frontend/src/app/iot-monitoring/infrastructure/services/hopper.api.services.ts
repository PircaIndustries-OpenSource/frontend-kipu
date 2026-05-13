import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HopperEntity } from '../../domain/hopper.entity';
import { HopperResource, HopperResponse } from '../models/hopper.response';
import { HopperAssembler } from '../assemblers/hopper.assembler';

@Injectable({ providedIn: 'root' })
export class HopperApiService {
  private httpClient = inject(HttpClient);

  createHopperSensor(sensor: HopperEntity): Observable<HopperEntity> {
    const body = HopperAssembler.toResourceFromEntity(sensor);
    return this.httpClient
      .post<HopperResource>(`http://localhost:3000/hopperWatch`, body)
      .pipe(map((response) => HopperAssembler.toEntityFromResource(response)));
  }

  getAllHopperSensors(): Observable<HopperEntity[]> {
    return this.httpClient
      .get<HopperResponse>(`http://localhost:3000/hopperWatch`)
      .pipe(map((response) => HopperAssembler.toEntitiesFromResponse(response)));
  }

  updateHopperSensor(sensor: HopperEntity): Observable<HopperEntity> {
    const body = HopperAssembler.toResourceFromEntity(sensor);

    return this.httpClient
      .put<HopperResource>(`http://localhost:3000/hopperWatch/${sensor.id}`, body)
      .pipe(map((response) => HopperAssembler.toEntityFromResource(response)));
  }

  deleteHopperSensor(id: string): Observable<void> {
    return this.httpClient.delete<void>(`http://localhost:3000/hopperWatch/${id}`);
  }
}
