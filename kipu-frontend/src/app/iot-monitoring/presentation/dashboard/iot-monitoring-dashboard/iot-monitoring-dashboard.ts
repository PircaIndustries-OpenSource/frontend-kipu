import { Component, OnInit } from '@angular/core';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-iot-monitoring-dashboard',
  imports: [
    MatTabNav,
    MatTabLink,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    MatTabNavPanel,
    RouterOutlet,
  ],
  templateUrl: './iot-monitoring-dashboard.html',
  styleUrl: './iot-monitoring-dashboard.css',
})
export class IotMonitoringDashboard {}
