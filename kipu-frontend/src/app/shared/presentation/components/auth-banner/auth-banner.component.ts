import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-banner',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="bg-slate-700 h-full p-12 flex flex-col justify-center text-white">
      <h1 class="text-4xl font-bold mb-2">Kipu</h1>
      <p class="text-slate-300 mb-10 text-lg">{{ 'identity.banner_system_desc' | translate }}</p>
 
      <div class="space-y-6">
        <div class="flex items-start gap-4">
          <div class="text-2xl">📊</div>
          <div>
            <h3 class="font-semibold text-white">{{ 'identity.banner_control_title' | translate }}</h3>
            <p class="text-slate-300 text-sm">{{ 'identity.banner_control_desc' | translate }}</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="text-2xl">📱</div>
          <div>
            <h3 class="font-semibold text-white">{{ 'identity.banner_platform_title' | translate }}</h3>
            <p class="text-slate-300 text-sm">{{ 'identity.banner_platform_desc' | translate }}</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="text-2xl">✅</div>
          <div>
            <h3 class="font-semibold text-white">{{ 'identity.banner_tracking_title' | translate }}</h3>
            <p class="text-slate-300 text-sm">{{ 'identity.banner_tracking_desc' | translate }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthBannerComponent { }