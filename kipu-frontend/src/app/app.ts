import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from './identity/infrastructure/oauth.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('kipu-frontend');
  private oauthService = inject(OAuthService);

  ngOnInit() {
    this.oauthService.initializeRedirectListeners();
  }
}
