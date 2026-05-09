import { Component, inject } from '@angular/core';
import {RequestCreate} from '../create-form/request-create';

@Component({
  selector: 'app-create-page',
  imports: [RequestCreate],
  templateUrl: './create-page.html',
  styleUrl: './create-page.css',
})
export class CreatePage {

}
