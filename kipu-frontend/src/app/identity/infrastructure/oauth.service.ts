import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { IdentityService } from './identity.service';
import { AuthStore } from '../application/auth.store';
import { OAuthUser } from '../domain/oauth-user.model';

@Injectable({
  providedIn: 'root',
})
export class OAuthService {
  private router = inject(Router);
  private msalService = inject(MsalService);
  private socialAuthService = inject(SocialAuthService);
  private identityService = inject(IdentityService);
  private authStore = inject(AuthStore);

  public newOAuthUser$ = new Subject<OAuthUser>();

  /**
   * Initializes MSAL redirect promises and Google auth listeners.
   */
  async initializeRedirectListeners(): Promise<void> {
    // 1. Handle Microsoft Redirect Promise
    try {
      await this.msalService.instance.initialize();
      const msalResult = await this.msalService.instance.handleRedirectPromise();
      if (msalResult) {
        const account = msalResult.account;
        await this.handleOAuthSuccess({
          name: account.name || '',
          email: account.username,
          provider: 'microsoft',
        });
      }
    } catch (error) {
      console.error('Error handling Microsoft Redirect:', error);
    }

    // 2. Handle Google Login State
    this.socialAuthService.authState.subscribe({
      next: async (googleUser: SocialUser) => {
        if (googleUser && googleUser.email) {
          await this.handleOAuthSuccess({
            name: googleUser.name || '',
            email: googleUser.email,
            givenName: googleUser.firstName,
            familyName: googleUser.lastName,
            provider: 'google',
          });
        }
      },
      error: (err) => {
        console.error('Google Social Auth state error:', err);
      }
    });
  }

  /**
   * Triggers Microsoft OAuth Redirect login flow
   */
  loginWithMicrosoft(): void {
    const redirectRequest = {
      scopes: ['user.read'],
      redirectUri: window.location.origin,
    };
    this.msalService.loginRedirect(redirectRequest).subscribe();
  }

  /**
   * Triggers Google OAuth login flow (programmatically via SDK)
   */
  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  /**
   * Handles successful OAuth authentication from either Google or Microsoft.
   */
  private async handleOAuthSuccess(oauthUser: OAuthUser): Promise<void> {
    try {
      this.identityService.checkEmailExists(oauthUser.email).subscribe({
        next: (exists) => {
          if (exists) {
            // User already registered: Fetch profile and log in
            this.identityService.getIdentityByEmail(oauthUser.email).subscribe({
              next: (user) => {
                if (user) {
                  this.authStore.login(user);
                  this.router.navigate(['/projects']);
                }
              },
              error: (err) => console.error('Failed to get identity by email:', err)
            });
          } else {
            // New User: Redirect to register with profile info via router state
            if (this.router.url === '/register') {
              this.newOAuthUser$.next(oauthUser);
            } else {
              this.router.navigate(['/register'], {
                state: { oauthUser },
              });
            }
          }
        },
        error: (err) => console.error('Failed checking email existence:', err)
      });
    } catch (error) {
      console.error('Error handling OAuth success flow:', error);
    }
  }
}
