import { Component, OnInit, inject, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccessibilityService } from '../../application/accessibility.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  host: {
    class: 'block w-full h-full'
  },
  styles: [`
    :host {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
    }
    .settings-wrapper {
      width: 100% !important;
      box-sizing: border-box !important;
      padding: 2rem 1rem !important;
      display: block !important;
    }
    .settings-card {
      width: 100% !important;
      max-width: 768px !important;
      margin: 0 auto !important;
      background: rgba(255, 255, 255, 0.8) !important;
      backdrop-filter: blur(12px) !important;
      border: 1px solid rgba(226, 232, 240, 0.5) !important;
      border-radius: 1rem !important;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
      padding: 2rem !important;
      box-sizing: border-box !important;
      display: block !important;
      position: relative !important;
      overflow: hidden !important;
    }
    .settings-grid {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 2rem !important;
      width: 100% !important;
    }
    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr !important;
      }
    }

    /* PrimeNG SelectButton Overrides to match Tailwind UI */
    :host ::ng-deep .p-selectbutton .p-button {
      background: #f1f5f9 !important; /* slate-100 */
      color: #475569 !important; /* slate-600 */
      border: 1px solid #e2e8f0 !important; /* slate-200 */
    }
    :host ::ng-deep .p-selectbutton .p-button.p-highlight {
      background: #3b82f6 !important; /* blue-500 */
      color: #ffffff !important;
      border-color: #3b82f6 !important;
    }
    :host ::ng-deep .p-selectbutton .p-button:first-child {
      border-top-left-radius: 0.5rem !important;
      border-bottom-left-radius: 0.5rem !important;
    }
    :host ::ng-deep .p-selectbutton .p-button:last-child {
      border-top-right-radius: 0.5rem !important;
      border-bottom-right-radius: 0.5rem !important;
    }
    :host ::ng-deep .p-selectbutton .p-button:not(:first-child):not(:last-child) {
      border-radius: 0 !important;
    }
  `],
  imports: [
    CommonModule,
    FormsModule,
    SelectButtonModule,
    ToggleSwitchModule,
    ToggleButtonModule,
    ButtonModule,
    TranslateModule
  ],
  templateUrl: './settings.html',
})
export class SettingsComponent implements OnInit {
  private accessibilityService = inject(AccessibilityService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  backPath: string = '/projects';

  contrastOptions: { label: string; value: string }[] = [];
  fontOptions: { label: string; value: string }[] = [];
  colorBlindnessOptions: { label: string; value: string }[] = [];
  languageOptions: { label: string; value: string }[] = [];

  // Getters and Setters for two-way model binding to Signals
  get contrast() {
    return this.accessibilityService.contrast();
  }
  set contrast(val: 'normal' | 'high') {
    this.accessibilityService.contrast.set(val);
  }

  get fontSize() {
    return this.accessibilityService.fontSize();
  }
  set fontSize(val: 'normal' | 'large' | 'xlarge') {
    this.accessibilityService.fontSize.set(val);
  }

  get dyslexicFont() {
    return this.accessibilityService.dyslexicFont();
  }
  set dyslexicFont(val: boolean) {
    this.accessibilityService.dyslexicFont.set(val);
  }

  get colorBlindness() {
    return this.accessibilityService.colorBlindness();
  }
  set colorBlindness(val: string) {
    this.accessibilityService.colorBlindness.set(val);
  }

  get reducedMotion() {
    return this.accessibilityService.reducedMotion();
  }
  set reducedMotion(val: boolean) {
    this.accessibilityService.reducedMotion.set(val);
  }

  get simplifiedUI() {
    return this.accessibilityService.simplifiedUI();
  }
  set simplifiedUI(val: boolean) {
    this.accessibilityService.simplifiedUI.set(val);
  }

  get language() {
    return this.accessibilityService.language();
  }
  set language(val: string) {
    this.accessibilityService.language.set(val);
    this.translate.use(val);
  }

  constructor() {
    // Re-build translated option labels when the language changes
    this.translate.onLangChange.subscribe(() => {
      this.buildTranslatedOptions();
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.backPath = params['from'] || '/projects';
    });
    this.buildTranslatedOptions();
  }

  goBack() {
    this.router.navigateByUrl(this.backPath);
  }

  private buildTranslatedOptions() {
    this.contrastOptions = [
      { label: this.translate.instant('settings.contrast_normal'), value: 'normal' },
      { label: this.translate.instant('settings.contrast_high'), value: 'high' }
    ];

    this.fontOptions = [
      { label: this.translate.instant('settings.font_normal'), value: 'normal' },
      { label: this.translate.instant('settings.font_large'), value: 'large' },
      { label: this.translate.instant('settings.font_xlarge'), value: 'xlarge' }
    ];

    this.colorBlindnessOptions = [
      { label: this.translate.instant('settings.color_blind_normal'), value: 'off' },
      { label: this.translate.instant('settings.color_blind_protanopia'), value: 'protanopia' },
      { label: this.translate.instant('settings.color_blind_deuteranopia'), value: 'deuteranopia' },
      { label: this.translate.instant('settings.color_blind_tritanopia'), value: 'tritanopia' }
    ];

    this.languageOptions = [
      { label: this.translate.instant('settings.language_es'), value: 'es' },
      { label: this.translate.instant('settings.language_en'), value: 'en' }
    ];
  }
}
