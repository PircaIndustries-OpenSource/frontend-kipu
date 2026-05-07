import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';
import { TeamStore } from '../../../application/team.store';

@Component({
  selector: 'app-users-page',
  imports: [
    RouterLinkActive,
    MatTabNav,
    MatTabNavPanel,
    RouterOutlet,
    MatTabLink,
    RouterModule,
    TranslateModule,
    TranslatePipe,
    MatRipple,
  ],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css',
})
export class UsersPage implements OnInit {
  protected teamStore = inject(TeamStore);
  searchTerm = ''
  ngOnInit() {

  }
}
