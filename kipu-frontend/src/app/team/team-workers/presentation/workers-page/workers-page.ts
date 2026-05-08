import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-workers-page',
  imports: [TranslatePipe, MatRipple],
  templateUrl: './workers-page.html',
  styleUrl: './workers-page.css',
})
export class WorkersPage {}
