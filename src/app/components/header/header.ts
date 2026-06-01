import { Component, inject } from '@angular/core';
import { AppState } from '../../services/app-state';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly app = inject(AppState);

  get title(): string {
    return this.app.t('עולם הדאטה', 'Data World');
  }

  get menuAria(): string {
    return this.app.t('תפריט', 'Menu');
  }

  get logoAria(): string {
    return this.app.t('עולם הדאטה', 'Data World');
  }

  get logoAlt(): string {
    return this.app.t('לוגו משרד הבריאות', 'Ministry of Health logo');
  }

  get langAria(): string {
    return this.app.t('החלפת שפה', 'Change language');
  }

  get darkAria(): string {
    return this.app.dark()
      ? this.app.t('מצב בהיר', 'Light mode')
      : this.app.t('מצב כהה', 'Dark mode');
  }

  get langLabel(): string {
    return this.app.lang() === 'he' ? 'EN' : 'עב';
  }

  toggleDark(): void {
    this.app.toggleDark();
  }

  toggleLang(): void {
    this.app.toggleLang();
  }
}
