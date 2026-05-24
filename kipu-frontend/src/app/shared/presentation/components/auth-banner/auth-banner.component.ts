import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-banner',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './auth-banner.component.html'
})
export class AuthBannerComponent {
  private translate = inject(TranslateService);

  get currentLang(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'es';
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }
}