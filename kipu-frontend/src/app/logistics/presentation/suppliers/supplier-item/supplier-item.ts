import { Component, input } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
} from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { SupplierEntity } from '../../../domain/supplier.entity';

@Component({
  selector: 'app-supplier-item',
  imports: [MatCard, MatCardActions, MatCardContent, TranslatePipe],
  templateUrl: './supplier-item.html',
  styleUrl: './supplier-item.css',
})
export class SupplierItem {
  supplier = input.required<SupplierEntity>();
}
