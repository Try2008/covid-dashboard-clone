import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-slim-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-slim-card.html',
  styleUrl: './kpi-slim-card.scss',
})
export class KpiSlimCard {
  @Input({ required: true }) title = '';
  @Input({ required: true }) value: string | number = '';
  @Input() change = '';
  @Input() subtitle = '';
  @Input() extra = '';

  get changeDirection(): 'up' | 'down' | 'flat' {
    if (!this.change) return 'flat';
    if (this.change.trim().startsWith('-')) return 'down';
    const numeric = parseFloat(this.change);
    if (Number.isFinite(numeric) && numeric > 0) return 'up';
    return 'flat';
  }
}
