import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SupplierEntity } from '../../../domain/supplier.entity';
import { SupplierItem } from '../supplier-item/supplier-item';

@Component({
  selector: 'app-supplier-list',
  imports: [SupplierItem, TranslatePipe, MatIcon],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css',
})
export class SupplierList {
  suppliers = input.required<SupplierEntity[]>();
}
