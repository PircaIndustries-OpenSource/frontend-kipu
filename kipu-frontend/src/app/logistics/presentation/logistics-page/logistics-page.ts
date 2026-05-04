import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-logistics-page',
  imports: [MatTabsModule, RouterModule, TranslatePipe],
  templateUrl: './logistics-page.html',
  styleUrl: './logistics-page.css',
})
export class LogisticsPage {}
