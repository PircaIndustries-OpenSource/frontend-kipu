import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-users-page',
  imports: [RouterLinkActive, MatTabNav, MatTabNavPanel, RouterOutlet, MatTabLink, RouterModule
  ,TranslateModule, TranslatePipe],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css',
})
export class UsersPage {}
