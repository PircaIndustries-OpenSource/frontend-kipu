import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GeolocalizationEntity } from '../../domain/geolocalization.entity';
import { GeolocalizationResponse } from '../models/geolocalization.response';
import { GeolocalizationAssembler } from '../assemblers/geolocalization.assembler';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GeolocalizationApiService {
  private httpClient = inject(HttpClient);

  private apiUrl = environment.kipuApiBaseUrl;
  private geoEndpoint = environment.kipuApiGeolocalizationEndpointPath;
  private geoUrl = `${this.apiUrl}${this.geoEndpoint}`;

  getAllGeolocalizationPoints(): Observable<GeolocalizationEntity[]> {
    return this.httpClient
      .get<GeolocalizationResponse>(this.geoUrl)
      .pipe(map((response) => GeolocalizationAssembler.toEntitiesFromResponse(response)));
  }
}
