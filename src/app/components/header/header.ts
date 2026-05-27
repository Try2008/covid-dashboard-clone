import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isDark = signal(false);

  toggleDark(): void {
    this.isDark.update(v => !v);
  }
}
