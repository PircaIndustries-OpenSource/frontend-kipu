import {Component, inject, OnInit} from '@angular/core';
import {LogisticsStore} from '../../application/logistics.store';
import {MaterialList} from '../material-list/material-list';
import {TranslatePipe} from '@ngx-translate/core';
@Component({
  selector: 'app-inventory-page',
  imports: [
    TranslatePipe,
    MaterialList
  ],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.css',
})
export class InventoryPage implements OnInit {
  protected logisticsStore = inject(LogisticsStore);
  protected readonly materials = this.logisticsStore.materials;
  ngOnInit() {
    this.logisticsStore.loadMaterials();
  }
}
