import {Component, input} from '@angular/core';
import {MaterialEntity} from '../../../domain/material.entity';
import {MaterialItem} from '../material-item/material-item';

@Component({
  selector: 'app-material-list',
  imports: [
    MaterialItem
  ],
  templateUrl: './material-list.html',
  styleUrl: './material-list.css',
})
export class MaterialList {
  materials = input.required<MaterialEntity[]>();
}
