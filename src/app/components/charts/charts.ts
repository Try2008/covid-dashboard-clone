import { Component, Input, HostListener, ElementRef, OnInit, OnChanges, SimpleChanges, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartComponent } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { AppState } from '../../services/app-state';

export interface LegendItem {
  label: string;
  color: string;
}

type RangeKey = 'week' | 'month' | 'all' | 'today';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule, HighchartsChartComponent],
  templateUrl: './charts.html',
  styleUrls: ['./charts.scss'],
})
export class ChartCardComponent implements OnInit, OnChanges {
  @Input({ required: true }) title = '';
  @Input() tooltipText = '';
  @Input() filterLabel = '';
  @Input() note = '';
  @Input() legendItems: LegendItem[] = [];
  @Input({ required: true }) options: Highcharts.Options = {};
  @Input() height = 320;

  readonly app = inject(AppState);

  Highcharts: typeof Highcharts = Highcharts;

  isDropdownOpen = false;
  selectedTimeRange: RangeKey = 'month';
  currentOptions: Highcharts.Options = {};

  readonly filterOptions = computed<{ label: string; value: RangeKey }[]>(() => {
    const t = (he: string, en: string) => this.app.t(he, en);
    return [
      { label: t('שבוע אחרון', 'Last week'),  value: 'week' },
      { label: t('חודש אחרון', 'Last month'), value: 'month' },
      { label: t('עד עכשיו',   'To date'),    value: 'all' },
    ];
  });

  get currentFilterLabel(): string {
    if (!this.filterLabel) return '';
    const base = this.getBaseLabel(this.filterLabel);
    const range = this.rangeLabel(this.selectedTimeRange);
    return base + (range ? (base ? ', ' : '') + range : '');
  }

  get moreOptionsAria()  { return this.app.t('אפשרויות', 'Options'); }
  get infoAria()         { return this.app.t('מידע נוסף', 'More info'); }

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.selectedTimeRange = this.detectRange(this.filterLabel);
    this.currentOptions = { ...this.options };
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterLabel']) {
      this.selectedTimeRange = this.detectRange(this.filterLabel);
    }
    if (changes['options'] || changes['filterLabel']) {
      this.updateChart();
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  selectOption(option: { label: string; value: RangeKey }) {
    this.selectedTimeRange = option.value;
    this.isDropdownOpen = false;
    this.updateChart();
  }

  private detectRange(label: string): RangeKey {
    if (!label) return 'month';
    if (/שבוע|week/i.test(label)) return 'week';
    if (/עד עכשיו|to date|כל הזמן/i.test(label)) return 'all';
    if (/היום|today/i.test(label)) return 'today';
    return 'month';
  }

  private rangeLabel(range: RangeKey): string {
    switch (range) {
      case 'week':  return this.app.t('שבוע אחרון', 'Last week');
      case 'month': return this.app.t('חודש אחרון', 'Last month');
      case 'all':   return this.app.t('עד עכשיו',   'To date');
      case 'today': return this.app.t('היום',       'Today');
    }
  }

  private getBaseLabel(label: string): string {
    const suffixes = [
      'חודש אחרון', 'שבוע אחרון', 'עד עכשיו', 'היום',
      'Last month', 'Last week',  'To date',   'Today',
    ];
    for (const suffix of suffixes) {
      if (label.endsWith(suffix)) {
        let prefix = label.substring(0, label.length - suffix.length);
        // Strip trailing separators
        prefix = prefix.replace(/[,\s]+$/, '');
        return prefix;
      }
    }
    return label;
  }

  private updateChart() {
    if (!this.options) return;

    let newOpts: Highcharts.Options = {};
    try {
      newOpts = JSON.parse(JSON.stringify(this.options));
    } catch (e) {
      newOpts = { ...this.options };
    }

    const xAxis = newOpts.xAxis as Highcharts.XAxisOptions;
    if (!xAxis || Array.isArray(xAxis) || !xAxis.categories || !newOpts.series) {
      this.currentOptions = newOpts;
      return;
    }

    const categories = xAxis.categories as string[];
    const isDateCategories = categories.length > 5 && categories.some(cat => /^\d{2}\.\d{2}$/.test(cat));

    if (isDateCategories) {
      let sliceCount = categories.length;
      if (this.selectedTimeRange === 'week') {
        sliceCount = 7;
      } else if (this.selectedTimeRange === 'month') {
        sliceCount = 29;
      } else if (this.selectedTimeRange === 'all') {
        sliceCount = categories.length;
      }

      if (sliceCount < categories.length) {
        xAxis.categories = categories.slice(-sliceCount);
        if (Array.isArray(newOpts.series)) {
          newOpts.series = newOpts.series.map((s: any) => {
            if (s.data && Array.isArray(s.data)) {
              s.data = s.data.slice(-sliceCount);
            }
            return s;
          });
        }
      }
    } else {
      let multiplier = 1.0;
      if (this.selectedTimeRange === 'week') {
        multiplier = 7 / 29;
      } else if (this.selectedTimeRange === 'all') {
        multiplier = 90 / 29;
      }

      if (multiplier !== 1.0 && Array.isArray(newOpts.series)) {
        newOpts.series = newOpts.series.map((s: any) => {
          if (s.data && Array.isArray(s.data)) {
            s.data = s.data.map((val: any) => {
              if (typeof val === 'number') {
                return Math.round(val * multiplier);
              } else if (val && typeof val === 'object' && typeof val.y === 'number') {
                return { ...val, y: Math.round(val.y * multiplier) };
              }
              return val;
            });
          }
          return s;
        });
      }
    }

    this.currentOptions = newOpts;
  }
}
