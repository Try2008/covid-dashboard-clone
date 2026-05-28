import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface KpiSubRow {
  label: string;
  value: string;
}

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrls: ['./overview.scss'],
})
export class KpiCardComponent {
  @Input({ required: true }) title = '';
  @Input() tooltipText = '';
  @Input() mainValue: string | null = null;
  @Input() subRows: KpiSubRow[] = [];
}
