import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {map, Observable} from 'rxjs';
import {HopperEntity} from '../../domain/hopper.entity';
import {HopperResponse} from '../models/hopper.response';
import {HopperAssembler} from '../assemblers/hopper.assembler';
import {SeismicEntity} from '../../domain/seismic.entity';
import {SeismicResponse} from '../models/seismic.response';
import {SeismicAssembler} from '../assemblers/seismic.assembler';
import {ConcreteEntity} from '../../domain/concrete.entity';
import {ConcreteResponse} from '../models/concrete.response';
import {ConcreteAssembler} from '../assemblers/concrete.assembler';
import {GeolocalizationEntity} from '../../domain/geolocalization.entity';
import {GeolocalizationResponse} from '../models/geolocalization.response';
import {GeolocalizationAssembler} from '../assemblers/geolocalization.assembler';

@Injectable({ providedIn: 'root' })
export class IotMonitoringApiService {
  private httpClient = inject(HttpClient);
  private readonly baseUrl = environment.kipuApiBaseUrl;
  private readonly ioTMonitoringEndpoint = environment.kipuApiIoTMonitoringEndpointPath;

  private readonly geolocalizationEndpoint = environment.kipuApiGeolocalizationEndpointPath;
  private readonly concreteCuringEndpoint = environment.kipuApiConcreteCuringEndpointPath;
  private readonly hopperWatchEndpoint = environment.kipuApiHopperWatchEndpointPath;
  private readonly seismicControlEndpoint = environment.kipuApiSeismicControlEndpointPath;

  getAllHopperSensors(): Observable<HopperEntity[]> {
    return this.httpClient.get<HopperResponse>(`${this.baseUrl}${this.ioTMonitoringEndpoint}${this.hopperWatchEndpoint}`)
      .pipe(map(response => HopperAssembler.toEntitiesFromResponse(response)));
  }

  getAllSeismicSensors(): Observable<SeismicEntity[]> {
    return this.httpClient.get<SeismicResponse>(`${this.baseUrl}${this.ioTMonitoringEndpoint}${this.seismicControlEndpoint}`)
      .pipe(map(response => SeismicAssembler.toEntitiesFromResponse(response)));
  }

  getAllConcreteSensors(): Observable<ConcreteEntity[]> {
    return this.httpClient.get<ConcreteResponse>(`${this.baseUrl}${this.ioTMonitoringEndpoint}${this.concreteCuringEndpoint}`)
      .pipe(map(response => ConcreteAssembler.toEntitiesFromResponse(response)));
  }

  getAllGeolocalizationPoints(): Observable<GeolocalizationEntity[]> {
    return this.httpClient.get<GeolocalizationResponse>(`${this.baseUrl}${this.ioTMonitoringEndpoint}${this.geolocalizationEndpoint}`)
      .pipe(map(response => GeolocalizationAssembler.toEntitiesFromResponse(response)));
  }
}
