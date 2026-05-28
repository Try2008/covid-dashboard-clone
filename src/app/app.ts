import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { Header } from './components/header/header';
import { Navbar } from './components/navbar/navbar';
import { SideMenu } from './components/side-menu/side-menu';
import { KpiCardComponent } from './components/overview/overview';
import { KpiSlimCard } from './components/kpi-slim-card/kpi-slim-card';
import { ChartCardComponent, LegendItem } from './components/charts/charts';

const C = {
  blue:   '#50cbfd',
  orange: '#ff7d67',
  green:  '#b6ca51',
  teal:   '#007f7f',
  purple: '#baa1ef',
};

function dailyDates(startDay: number, startMonth: number, count: number): string[] {
  const dates: string[] = [];
  let d = startDay;
  let m = startMonth;
  const daysInMonth = (mm: number) => [31,28,31,30,31,30,31,31,30,31,30,31][mm - 1];
  for (let i = 0; i < count; i++) {
    dates.push(`${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}`);
    d++;
    if (d > daysInMonth(m)) { d = 1; m++; }
  }
  return dates;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Navbar,
    SideMenu,
    KpiCardComponent,
    KpiSlimCard,
    ChartCardComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

  /* ════════ Section 1: מבט על ════════ */
  overviewKpis = [
    {
      title: 'מאומתים אתמול',
      mainValue: '0',
      subRows: [
        { label: 'מחצות', value: '0' },
        { label: 'סה"כ', value: '4,863,945' },
      ],
    },
    {
      title: 'חולים פעילים',
      mainValue: '361',
      subRows: [
        { label: 'בבי"ח', value: '196' },
      ],
    },
    {
      title: 'מתחסנים',
      mainValue: null,
      subRows: [
        { label: 'מנה 1',    value: '6,722,627' },
        { label: 'מנה 2',    value: '6,006,974' },
        { label: 'מנה 3',    value: '3,854,872' },
        { label: 'מנה 4',    value: '474,534' },
        { label: 'אומיקרון', value: '407,432' },
      ],
    },
    {
      title: 'נפטרים מצטבר',
      mainValue: '13,174',
      subRows: [],
    },
    {
      title: 'אחוז נבדקים חיוביים אתמול',
      mainValue: '0%',
      subRows: [
        { label: 'נבדקים לגילוי הנגיף אתמול', value: '84' },
        { label: 'כלל הבדיקות אתמול',         value: '92' },
      ],
    },
  ];

  weekSummary = [
    { title: 'מספר המאומתים', value: '40',    change: '-28.6%', subtitle: 'משבעה ימים קודמים', extra: '' },
    { title: 'מספר נפטרים',   value: '0',     change: '0%',     subtitle: 'משבעה ימים קודמים', extra: '' },
    { title: 'מספר נבדקים',   value: '2,257', change: '-11.4%', subtitle: 'משבעה ימים קודמים', extra: '1.8% נבדקים חיוביים' },
  ];

  /* ════════ Section 2: מדדים מרכזיים ════════ */
  weeklyCasesAvgOptions: Highcharts.Options = this.column(
    ['26.04-02.05', '03.05-09.05', '10.05-16.05'],
    [{ name: 'ממוצע', data: [7, 8, 5], color: C.blue }],
    { yMax: 10, reverseX: true, hideLegend: true },
  );

  monthDates = dailyDates(18, 4, 29);  // 18.04 → 16.05

  newCasesDailyOptions: Highcharts.Options = this.comboBarLine(
    this.monthDates,
    {
      bar:  { name: 'מאומתים חדשים',      data: this.noisySeries(29, 1, 0.6),  color: C.blue },
      line: { name: 'ממוצע נע מאומתים',   data: this.smoothSeries(29, 1.1, 0.3), color: C.orange },
    },
    { reverseX: true },
  );
  newCasesLegend: LegendItem[] = [
    { label: 'מאומתים חדשים',    color: C.blue },
    { label: 'ממוצע נע מאומתים', color: C.orange },
  ];

  /* ════════ Section 3: תחלואה ואשפוזי ילדים ════════ */
  childrenTrendOptions: Highcharts.Options = this.multiLine(
    this.monthDates,
    [
      { name: '0-4',   data: this.smoothSeries(29, 0.30, 0.18), color: C.blue },
      { name: '5-11',  data: this.smoothSeries(29, 0.45, 0.22), color: C.green },
      { name: '12-15', data: this.smoothSeries(29, 0.20, 0.15), color: C.teal },
      { name: '16-19', data: this.smoothSeries(29, 0.35, 0.20), color: C.purple },
    ],
    { reverseX: true, yMax: 1 },
  );
  childrenLegend: LegendItem[] = [
    { label: '0-4',   color: C.blue },
    { label: '5-11',  color: C.green },
    { label: '12-15', color: C.teal },
    { label: '16-19', color: C.purple },
  ];

  /* ════════ Section 4: השפעת התחסנות על התחלואה ════════ */
  vaxEffectCasesOptions: Highcharts.Options = this.multiLine(
    this.monthDates,
    [
      { name: 'לא מחוסנים',          data: this.smoothSeries(29, 540, 90), color: C.blue },
      { name: 'מחוסנים ללא תוקף',    data: this.smoothSeries(29, 320, 60), color: C.green },
      { name: 'מחוסנים',             data: this.smoothSeries(29, 140, 40), color: C.teal },
    ],
    { reverseX: true, yMax: 750 },
  );
  vaxEffectLegend: LegendItem[] = [
    { label: 'לא מחוסנים',       color: C.blue },
    { label: 'מחוסנים ללא תוקף', color: C.green },
    { label: 'מחוסנים',          color: C.teal },
  ];

  /* ════════ Section 5: נפטרים ════════ */
  deceasedDailyOptions: Highcharts.Options = this.comboBarLine(
    this.monthDates,
    {
      bar:  { name: 'נפטרים',           data: this.noisySeries(29, 0.7, 0.4), color: C.teal },
      line: { name: 'ממוצע נע נפטרים',  data: this.smoothSeries(29, 0.8, 0.25), color: C.orange },
    },
    { reverseX: true },
  );
  deceasedLegend: LegendItem[] = [
    { label: 'נפטרים',          color: C.teal },
    { label: 'ממוצע נע נפטרים', color: C.orange },
  ];

  deceasedByVaxOptions: Highcharts.Options = this.multiLine(
    this.monthDates,
    [
      { name: 'לא מחוסנים',       data: this.smoothSeries(29, 0.32, 0.06), color: C.blue },
      { name: 'מחוסנים ללא תוקף', data: this.smoothSeries(29, 0.18, 0.04), color: C.green },
      { name: 'מחוסנים',          data: this.smoothSeries(29, 0.07, 0.02), color: C.teal },
    ],
    { reverseX: true, yMax: 0.5 },
  );
  deceasedByVaxLegend: LegendItem[] = this.vaxEffectLegend;

  /* ════════ Section 6: בדיקות ════════ */
  positivePctOptions: Highcharts.Options = this.multiLine(
    this.monthDates,
    [
      { name: 'חיוביים בPCR',        data: this.smoothSeries(29, 2.2, 0.6), color: C.blue },
      { name: 'חיוביים באנטיגן מוסדי', data: this.smoothSeries(29, 1.4, 0.5), color: C.green },
    ],
    { reverseX: true, yMax: 10, ySuffix: '%' },
  );
  positivePctLegend: LegendItem[] = [
    { label: 'חיוביים בPCR',         color: C.blue },
    { label: 'חיוביים באנטיגן מוסדי', color: C.green },
  ];

  testsDailyOptions: Highcharts.Options = this.stackedBarWithLine(
    this.monthDates,
    [
      { name: 'בדיקות PCR',  data: this.noisySeries(29, 1800, 600), color: C.blue },
      { name: 'אנטיגן מוסדי', data: this.noisySeries(29, 900,  300), color: C.green },
    ],
    { name: 'ממוצע נע סך הבדיקות', data: this.smoothSeries(29, 2700, 600), color: C.orange },
    { reverseX: true },
  );
  testsLegend: LegendItem[] = [
    { label: 'בדיקות PCR',         color: C.blue },
    { label: 'אנטיגן מוסדי',       color: C.green },
    { label: 'ממוצע נע סך הבדיקות', color: C.orange },
  ];

  testsByAgeOptions: Highcharts.Options = this.groupedColumn(
    ['0-4', '5-11', '12-15', '16-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70+'],
    [
      { name: 'נבדקים',          data: [180, 420, 260, 290, 510, 480, 410, 350, 280, 220], color: C.blue },
      { name: 'נבדקים חיוביים',  data: [  3,   7,   5,   6,  10,   9,   8,   6,   4,   3], color: C.teal },
    ],
  );
  testsByAgeLegend: LegendItem[] = [
    { label: 'נבדקים',         color: C.blue },
    { label: 'נבדקים חיוביים', color: C.teal },
  ];

  /* ════════ Section 7: תחקורים נוספים ════════ */
  weeklyCasesAvgOptions2 = this.weeklyCasesAvgOptions;

  investigationsTimelineOptions: Highcharts.Options = this.comboBarPercent(
    this.monthDates,
    { name: 'מאומתים',           data: this.noisySeries(29, 8, 4),  color: C.blue, axis: 0 },
    { name: '% מחוסנים מצטבר',   data: this.cumulativePercent(29, 72, 76), color: C.teal, axis: 1 },
    { reverseX: true },
  );
  investigationsLegend: LegendItem[] = [
    { label: '% מחוסנים מצטבר', color: C.teal },
    { label: 'מאומתים',         color: C.blue },
  ];

  /* ════════ Section 8: תחלואה חוזרת ומחלימים ════════ */
  recurrentByAgeOptions: Highcharts.Options = this.horizontalGrouped(
    ['16-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80+'],
    [
      { name: 'לא מחוסנים', data: [ 24,  82,  61,  44,  31,  22,  14,  9 ], color: C.blue },
      { name: 'מחוסנים',    data: [ 41, 138, 102,  74,  53,  37,  21, 12 ], color: C.teal },
    ],
  );
  recurrentByAgeLegend: LegendItem[] = [
    { label: 'לא מחוסנים', color: C.blue },
    { label: 'מחוסנים',    color: C.teal },
  ];

  recurrentDailyOptions: Highcharts.Options = this.stackedBarWithLine(
    this.monthDates,
    [
      { name: 'לא מחוסנים', data: this.noisySeries(29, 4, 2), color: C.blue },
      { name: 'מחוסנים',    data: this.noisySeries(29, 7, 3), color: C.teal },
    ],
    { name: 'ממוצע נע סך מאומתים', data: this.smoothSeries(29, 11, 3), color: C.orange },
    { reverseX: true },
  );
  recurrentDailyLegend: LegendItem[] = [
    { label: 'לא מחוסנים',           color: C.blue },
    { label: 'מחוסנים',              color: C.teal },
    { label: 'ממוצע נע סך מאומתים', color: C.orange },
  ];

  recoveredDailyOptions: Highcharts.Options = this.comboBarLine(
    this.monthDates,
    {
      bar:  { name: 'מחלימים',          data: this.noisySeries(29, 28, 12), color: C.teal },
      line: { name: 'ממוצע נע מחלימים', data: this.smoothSeries(29, 30, 6), color: C.orange },
    },
    { reverseX: true },
  );
  recoveredLegend: LegendItem[] = [
    { label: 'מחלימים',          color: C.teal },
    { label: 'ממוצע נע מחלימים', color: C.orange },
  ];

  /* ════════ Section 9: התחסנות האוכלוסיה ════════ */
  vaxDailyOptions: Highcharts.Options = this.stackedColumn(
    this.monthDates,
    [
      { name: 'מנה 1', data: this.noisySeries(29, 110, 40), color: C.blue },
      { name: 'מנה 2', data: this.noisySeries(29,  80, 30), color: C.green },
      { name: 'מנה 3', data: this.noisySeries(29,  60, 25), color: C.teal },
      { name: 'מנה 4', data: this.noisySeries(29,  35, 20), color: C.purple },
    ],
    { reverseX: true },
  );
  vaxDailyLegend: LegendItem[] = [
    { label: 'מנה 1', color: C.blue },
    { label: 'מנה 2', color: C.green },
    { label: 'מנה 3', color: C.teal },
    { label: 'מנה 4', color: C.purple },
  ];

  vaxCumulativeOptions: Highcharts.Options = this.stackedArea(
    this.monthDates,
    [
      { name: 'לא מחוסנים',       data: this.smoothSeries(29, 22, 1), color: C.blue },
      { name: 'מחוסנים ללא תוקף', data: this.smoothSeries(29, 28, 1), color: C.green },
      { name: 'מחוסנים',          data: this.smoothSeries(29, 50, 1), color: C.teal },
    ],
    { reverseX: true, yMax: 100, ySuffix: '%' },
  );
  vaxCumulativeLegend: LegendItem[] = this.vaxEffectLegend;

  vaxByAgeOptions: Highcharts.Options = this.horizontalStacked(
    ['0-4', '5-11', '12-15', '16-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70+'],
    [
      { name: 'לא מחוסנים',       data: [98, 56, 28, 22, 24, 18, 14, 10,  6,  4], color: C.blue },
      { name: 'מחוסנים ללא תוקף', data: [ 2, 28, 36, 32, 30, 26, 22, 18, 12,  8], color: C.green },
      { name: 'מחוסנים',          data: [ 0, 16, 36, 46, 46, 56, 64, 72, 82, 88], color: C.teal },
    ],
    { ySuffix: '%' },
  );
  vaxByAgeLegend: LegendItem[] = this.vaxEffectLegend;

  /* ════════ Highcharts builder helpers ════════ */

  private base(): Highcharts.Options {
    return {
      credits: { enabled: false },
      title:   { text: undefined },
      legend:  { enabled: false },
      tooltip: { shared: true, useHTML: true, style: { fontFamily: 'Open Sans Hebrew' } },
      xAxis: {
        lineColor: '#e6ebf2',
        tickColor: '#e6ebf2',
        labels: { style: { fontFamily: 'Open Sans Hebrew', color: '#8794a3', fontSize: '11px' } },
      },
      yAxis: {
        title: { text: undefined },
        gridLineColor: '#eef1f6',
        labels: { style: { fontFamily: 'Open Sans Hebrew', color: '#8794a3', fontSize: '11px' } },
      },
    };
  }

  private xAxis(categories: string[], reverseX: boolean): Highcharts.XAxisOptions {
    return { ...(this.base().xAxis as Highcharts.XAxisOptions), categories, reversed: reverseX };
  }

  private yAxisOpts(yMax?: number, ySuffix = ''): Highcharts.YAxisOptions {
    const base = this.base().yAxis as Highcharts.YAxisOptions;
    return {
      ...base,
      max: yMax,
      labels: {
        format: '{value}' + ySuffix,
        style: { fontFamily: 'Open Sans Hebrew', color: '#8794a3', fontSize: '11px' },
      },
    };
  }

  private column(
    categories: string[],
    series: { name: string; data: number[]; color: string }[],
    o: { reverseX?: boolean; yMax?: number; hideLegend?: boolean } = {},
  ): Highcharts.Options {
    return {
      ...this.base(),
      chart: { type: 'column' },
      xAxis: this.xAxis(categories, !!o.reverseX),
      yAxis: this.yAxisOpts(o.yMax),
      plotOptions: { column: { borderRadius: 3, pointPadding: 0.15, groupPadding: 0.15 } },
      series: series.map(s => ({ type: 'column', ...s })),
    };
  }

  private multiLine(
    categories: string[],
    series: { name: string; data: number[]; color: string }[],
    o: { reverseX?: boolean; yMax?: number; ySuffix?: string } = {},
  ): Highcharts.Options {
    return {
      ...this.base(),
      chart: { type: 'line' },
      xAxis: this.xAxis(categories, !!o.reverseX),
      yAxis: this.yAxisOpts(o.yMax, o.ySuffix ?? ''),
      series: series.map(s => ({ type: 'line', marker: { enabled: false }, lineWidth: 2, ...s })),
    };
  }

  private comboBarLine(
    categories: string[],
    s: {
      bar:  { name: string; data: number[]; color: string };
      line: { name: string; data: number[]; color: string };
    },
    o: { reverseX?: boolean } = {},
  ): Highcharts.Options {
    return {
      ...this.base(),
      chart: { type: 'column' },
      xAxis: this.xAxis(categories, !!o.reverseX),
      yAxis: this.yAxisOpts(),
      plotOptions: { column: { borderRadius: 2, pointPadding: 0.04, groupPadding: 0.05 } },
      series: [
        { type: 'column', ...s.bar },
        { type: 'spline', marker: { enabled: false }, lineWidth: 2, ...s.line },
      ],
    };
  }

  private stackedColumn(
    categories: string[],
    series: { name: string; data: number[]; color: string }[],
    o: { reverseX?: boolean } = {},
  ): Highcharts.Options {
    return {
      ...this.base(),
      chart: { type: 'column' },
      xAxis: this.xAxis(categories, !!o.reverseX),
      yAxis: this.yAxisOpts(),
      plotOptions: { column: { stacking: 'normal', borderRadius: 0, pointPadding: 0.04, groupPadding: 0.05 } },
      series: series.map(s => ({ type: 'column', ...s })),
    };
  }

  private stackedBarWithLine(
    categories: string[],
    stacked: { name: string; data: number[]; color: string }[],
    line: { name: string; data: number[]; color: string },
    o: { reverseX?: boolean } = {},
  ): Highcharts.Options {
    return {
      ...this.base(),
      chart: { type: 'column' },
      xAxis: this.xAxis(categories, !!o.reverseX),
      yAxis: this.yAxisOpts(),
      plotOptions: { column: { stacking: 'normal', borderRadius: 0, pointPadding: 0.04, groupPadding: 0.05 } },
      series: [
        ...stacked.map(s => ({ type: 'column' as const, ...s })),
        { type: 'spline', marker: { enabled: false }, lineWidth: 2, ...line },
      ],
    };
  }

  private comboBarPercent(
    categories: string[],
    bar: { name: string; data: number[]; color: string; axis: 0 | 1 },
    line: { name: string; data: number[]; color: string; axis: 0 | 1 },
    o: { reverseX?: boolean } = {},
  ): Highcharts.Options {
    const baseY = this.yAxisOpts();
    return {
      ...this.base(),
      chart: { type: 'column' },
      xAxis: this.xAxis(categories, !!o.reverseX),
      yAxis: [
        baseY,
        { ...baseY, opposite: true, max: 100, labels: { ...baseY.labels, format: '{value}%' } },
      ],
      plotOptions: { column: { borderRadius: 2, pointPadding: 0.1, groupPadding: 0.1 } },
      series: [
        { type: 'column', yAxis: bar.axis,  name: bar.name,  data: bar.data,  color: bar.color },
        { type: 'spline', yAxis: line.axis, name: line.name, data: line.data, color: line.color, marker: { enabled: false }, lineWidth: 2 },
      ],
    };
  }

  private groupedColumn(
    categories: string[],
    series: { name: string; data: number[]; color: string }[],
  ): Highcharts.Options {
    return {
      ...this.base(),
      chart: { type: 'column' },
      xAxis: this.xAxis(categories, false),
      yAxis: this.yAxisOpts(),
      plotOptions: { column: { borderRadius: 3, pointPadding: 0.1, groupPadding: 0.12 } },
      series: series.map(s => ({ type: 'column', ...s })),
    };
  }

  private horizontalGrouped(
    categories: string[],
    series: { name: string; data: number[]; color: string }[],
  ): Highcharts.Options {
    return {
      ...this.base(),
      chart: { type: 'bar' },
      xAxis: { ...(this.base().xAxis as Highcharts.XAxisOptions), categories },
      yAxis: this.yAxisOpts(),
      plotOptions: { bar: { borderRadius: 2 } },
      series: series.map(s => ({ type: 'bar', ...s })),
    };
  }

  private horizontalStacked(
    categories: string[],
    series: { name: string; data: number[]; color: string }[],
    o: { ySuffix?: string } = {},
  ): Highcharts.Options {
    return {
      ...this.base(),
      chart: { type: 'bar' },
      xAxis: { ...(this.base().xAxis as Highcharts.XAxisOptions), categories },
      yAxis: this.yAxisOpts(100, o.ySuffix ?? ''),
      plotOptions: { bar: { stacking: 'percent', borderRadius: 0 } },
      series: series.map(s => ({ type: 'bar', ...s })),
    };
  }

  private stackedArea(
    categories: string[],
    series: { name: string; data: number[]; color: string }[],
    o: { reverseX?: boolean; yMax?: number; ySuffix?: string } = {},
  ): Highcharts.Options {
    return {
      ...this.base(),
      chart: { type: 'area' },
      xAxis: this.xAxis(categories, !!o.reverseX),
      yAxis: this.yAxisOpts(o.yMax, o.ySuffix ?? ''),
      plotOptions: { area: { stacking: 'percent', fillOpacity: 0.55, lineWidth: 1, marker: { enabled: false } } },
      series: series.map(s => ({ type: 'area', ...s })),
    };
  }

  /* ════════ Mock-data generators (deterministic) ════════ */

  private prng(seed: number): () => number {
    let s = seed | 0;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  private noisySeries(n: number, base: number, jitter: number, seed = 7): number[] {
    const r = this.prng(seed + Math.floor(base));
    return Array.from({ length: n }, () => Math.max(0, +(base + (r() - 0.5) * 2 * jitter).toFixed(2)));
  }

  private smoothSeries(n: number, base: number, drift: number, seed = 11): number[] {
    const r = this.prng(seed + Math.floor(base * 100));
    const out: number[] = [];
    let v = base;
    for (let i = 0; i < n; i++) {
      v = Math.max(0, v + (r() - 0.5) * drift * 0.6);
      out.push(+v.toFixed(2));
    }
    return out;
  }

  private cumulativePercent(n: number, start: number, end: number): number[] {
    const step = (end - start) / Math.max(1, n - 1);
    return Array.from({ length: n }, (_, i) => +(start + step * i).toFixed(2));
  }
}
