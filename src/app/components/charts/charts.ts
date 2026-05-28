import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartComponent } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

export interface LegendItem {
  label: string;
  color: string;
}

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule, HighchartsChartComponent],
  templateUrl: './charts.html',
  styleUrls: ['./charts.scss'],
})
export class ChartCardComponent {
  @Input({ required: true }) title = '';
  @Input() tooltipText = '';
  @Input() filterLabel = '';
  @Input() note = '';
  @Input() legendItems: LegendItem[] = [];
  @Input({ required: true }) options: Highcharts.Options = {};
  @Input() height = 320;

  Highcharts: typeof Highcharts = Highcharts;
}
