import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrls: ['./overview.scss'],
})
export class KpiCardComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) value: string | number = '';
  @Input() subtitle = '';
  @Input() trend: 'up' | 'down' | 'flat' | null = null;
  @Input() trendText = '';
  @Input() accent: 'blue' | 'orange' | 'green' | 'teal' | 'purple' = 'blue';
}
