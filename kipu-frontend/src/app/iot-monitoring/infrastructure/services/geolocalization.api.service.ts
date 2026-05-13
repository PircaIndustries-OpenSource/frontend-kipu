import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { GeolocalizationEntity } from '../../domain/geolocalization.entity';
import { GeolocalizationResponse } from '../models/geolocalization.response';
import { GeolocalizationAssembler } from '../assemblers/geolocalization.assembler';

@Injectable({ providedIn: 'root' })
export class GeolocalizationApiService {
  private httpClient = inject(HttpClient);

  getAllGeolocalizationPoints(): Observable<GeolocalizationEntity[]> {
    return this.httpClient
      .get<GeolocalizationResponse>(`http://localhost:3000/geolocalization`)
      .pipe(map((response) => GeolocalizationAssembler.toEntitiesFromResponse(response)));
  }
}
