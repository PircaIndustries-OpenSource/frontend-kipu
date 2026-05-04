import {computed, inject, Injectable, signal} from '@angular/core';
import {MaterialEntity} from '../domain/material.entity';
import {LogisticsApi} from '../infrastructure/logistics.api';
import {RequestEntity} from '../domain/request.entity';

@Injectable({
  providedIn: 'root',
})
export class LogisticsStore {
  logisticsApi = inject(LogisticsApi);
  // MATERIAL
  private materialsSignal = signal<MaterialEntity[]>([]);
  private selectedCategorySignal = signal<string>('');
  readonly materials = computed(() => this.materialsSignal());
  readonly filteredMaterials = computed(()=>{
    const category = this.selectedCategorySignal();
    const allMaterials = this.materialsSignal();
    console.log('Computed with category: ', category);
    if(!category){
      return allMaterials;
    }
    return allMaterials.filter(material => material.category === category);
  });
  readonly uniqueCategories = computed(() => {
    const categories = this.materialsSignal().map(material => material.category);
    return [...new Set(categories)];
  })
  readonly totalMaterials = computed(() => this.materials().length);
  readonly criticalMaterialsCount = computed(() => this.materials().filter(material => material.currentStock <= material.minimumLimit).length)
  loadMaterials(){
    if(this.materialsSignal().length === 0){
      this.logisticsApi.getAllMaterials().subscribe(
        data => {
          this.materialsSignal.set(data);
        }
      )
    }
  }
  filterByCategory(category:string){
    this.selectedCategorySignal.set(category);
    console.log('Store set category: ', category);
  }
  clearFilter(){
    this.selectedCategorySignal.set('');
  }
  //REQUEST
  requestsSignal = signal<RequestEntity[]>([]);
  readonly requests = computed(() => this.requestsSignal());
  loadRequest(){
    if(this.requestsSignal().length === 0){
      this.logisticsApi.getAllRequest().subscribe(
        data =>{
          this.requestsSignal.set(data);
        }
      )
    }
  }
}
