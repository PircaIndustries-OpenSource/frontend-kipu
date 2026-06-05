import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityService {
  contrast = signal<'normal' | 'high'>(
    (localStorage.getItem('access-contrast') as 'normal' | 'high') || 'normal'
  );
  fontSize = signal<'normal' | 'large' | 'xlarge'>(
    (localStorage.getItem('access-font') as 'normal' | 'large' | 'xlarge') || 'normal'
  );
  dyslexicFont = signal<boolean>(localStorage.getItem('access-dyslexic') === 'true');
  colorBlindness = signal<string>(localStorage.getItem('access-colorblind') || 'off');
  reducedMotion = signal<boolean>(localStorage.getItem('access-motion') === 'true');
  simplifiedUI = signal<boolean>(localStorage.getItem('access-simplified') === 'true');
  language = signal<string>(localStorage.getItem('access-lang') || 'es');

  constructor() {
    effect(() => {
      const body = document.body;

      // Contraste
      if (this.contrast() === 'high') {
        body.classList.add('accessibility-high-contrast');
      } else {
        body.classList.remove('accessibility-high-contrast');
      }

      // Tamaño de Letra
      body.classList.remove('accessibility-font-large', 'accessibility-font-xlarge');
      if (this.fontSize() === 'large') body.classList.add('accessibility-font-large');
      if (this.fontSize() === 'xlarge') body.classList.add('accessibility-font-xlarge');

      // Tipografía Disléxica
      if (this.dyslexicFont()) {
        body.classList.add('accessibility-font-dyslexic');
      } else {
        body.classList.remove('accessibility-font-dyslexic');
      }

      // Filtros de Daltonismo
      body.classList.remove('accessibility-protanopia', 'accessibility-deuteranopia', 'accessibility-tritanopia');
      if (this.colorBlindness() !== 'off') {
        body.classList.add(`accessibility-${this.colorBlindness()}`);
      }

      // Animaciones Reducidas
      if (this.reducedMotion()) {
        body.classList.add('accessibility-reduced-motion');
      } else {
        body.classList.remove('accessibility-reduced-motion');
      }

      // Persistencia
      localStorage.setItem('access-contrast', this.contrast());
      localStorage.setItem('access-font', this.fontSize());
      localStorage.setItem('access-dyslexic', String(this.dyslexicFont()));
      localStorage.setItem('access-colorblind', this.colorBlindness());
      localStorage.setItem('access-motion', String(this.reducedMotion()));
      localStorage.setItem('access-simplified', String(this.simplifiedUI()));
      localStorage.setItem('access-lang', this.language());
    });
  }
}
