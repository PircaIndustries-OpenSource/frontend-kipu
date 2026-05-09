import { Component } from '@angular/core';
import { MatTabLink, MatTabNav, MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-team-page',
  imports: [
    RouterLinkActive,
    MatTabLink,
    MatTabNav,
    RouterLink,
    MatTabNavPanel,
    RouterOutlet,
    RouterModule,
    TranslatePipe,
  ],
  templateUrl: './team-page.html',
  styleUrl: './team-page.css',
})
export class TeamPage {}
