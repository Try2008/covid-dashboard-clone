import { Injectable, signal, effect } from '@angular/core';

export type Lang = 'he' | 'en';

@Injectable({ providedIn: 'root' })
export class AppState {
  readonly dark = signal(false);
  readonly lang = signal<Lang>('he');

  constructor() {
    effect(() => {
      const html = document.documentElement;
      html.classList.toggle('dark', this.dark());
      const l = this.lang();
      html.setAttribute('lang', l);
      html.setAttribute('dir', l === 'he' ? 'rtl' : 'ltr');
    });
  }

  toggleDark(): void {
    this.dark.update(v => !v);
  }

  toggleLang(): void {
    this.lang.update(l => (l === 'he' ? 'en' : 'he'));
  }

  t(he: string, en: string): string {
    return this.lang() === 'en' ? en : he;
  }
}
