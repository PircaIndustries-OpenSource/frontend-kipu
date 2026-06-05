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
