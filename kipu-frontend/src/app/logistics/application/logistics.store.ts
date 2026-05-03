import {computed, inject, Injectable, signal} from '@angular/core';
import {MaterialEntity} from '../domain/material.entity';
import {LogisticsApi} from '../infrastructure/logistics.api';

@Injectable({
  providedIn: 'root',
})
export class LogisticsStore {
  logisticsApi = inject(LogisticsApi);
  private materialsSignal = signal<MaterialEntity[]>([]);
  readonly materials = computed(() => this.materialsSignal());
  loadMaterials(){
    if(this.materialsSignal().length === 0){
      this.logisticsApi.getAllMaterials().subscribe(
        data => {
          this.materialsSignal.set(data);
        }
      )
    }
  }
}
