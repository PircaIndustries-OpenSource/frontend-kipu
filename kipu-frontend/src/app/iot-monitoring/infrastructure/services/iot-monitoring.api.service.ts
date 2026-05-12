import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { HopperEntity } from '../../domain/hopper.entity';
import { HopperResponse } from '../models/hopper.response';
import { HopperAssembler } from '../assemblers/hopper.assembler';
import { GeolocalizationEntity } from '../../domain/geolocalization.entity';
import { GeolocalizationResponse } from '../models/geolocalization.response';
import { GeolocalizationAssembler } from '../assemblers/geolocalization.assembler';

@Injectable({ providedIn: 'root' })
export class IotMonitoringApiService {
  private httpClient = inject(HttpClient);

  getAllHopperSensors(): Observable<HopperEntity[]> {
    return this.httpClient
      .get<HopperResponse>(`http://localhost:3000/hopper-watch`)
      .pipe(map((response) => HopperAssembler.toEntitiesFromResponse(response)));
  }

  getAllGeolocalizationPoints(): Observable<GeolocalizationEntity[]> {
    return this.httpClient
      .get<GeolocalizationResponse>(`http://localhost:3000/geolocalization`)
      .pipe(map((response) => GeolocalizationAssembler.toEntitiesFromResponse(response)));
  }
}
