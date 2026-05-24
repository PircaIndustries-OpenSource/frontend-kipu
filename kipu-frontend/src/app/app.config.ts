import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MsalModule } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { SocialLoginModule, GoogleLoginProvider, SOCIAL_AUTH_CONFIG } from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({prefix: './i18n/', suffix: '.json'}),
      fallbackLang: 'en'
    }),
    provideNativeDateAdapter(),
    importProvidersFrom(
      SocialLoginModule,
      MsalModule.forRoot(
        new PublicClientApplication({
          auth: {
            clientId: environment.microsoftClientId,
            authority: 'https://login.microsoftonline.com/common',
            redirectUri: window.location.origin
          },
          cache: {
            cacheLocation: 'sessionStorage'
          }
        }),
        {} as any,
        {} as any
      )
    ),
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId)
          }
        ],
        onError: (err: any) => console.error(err)
      }
    }
  ]
};
