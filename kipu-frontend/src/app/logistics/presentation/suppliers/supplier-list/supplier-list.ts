import { Component, input } from '@angular/core';
import { Supplier } from '../../../domain/supplier';
import { SupplierItem } from '../supplier-item/supplier-item';

@Component({
  selector: 'app-supplier-list',
  imports: [SupplierItem],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css',
})
export class SupplierList {
  suppliers = input.required<Supplier[]>();
}
