import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { Header } from './components/header/header';
import { Navbar } from './components/navbar/navbar';
import { KpiCardComponent } from './components/overview/overview';
import { ChartCardComponent } from './components/charts/charts';
import { TableCardComponent, TableColumn } from './components/tables/tables';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Navbar,
    KpiCardComponent,
    ChartCardComponent,
    TableCardComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /* ── Section 1: KPIs ── */
  overviewKpis = [
    { title: 'מאומתים אתמול',          value: '1,245',     subtitle: 'מצטבר: 4,512,330', trend: 'up'   as const, trendText: '+8.3% מהיום הקודם', accent: 'blue'   as const },
    { title: 'חולים פעילים',           value: '8,902',     subtitle: 'מתוכם 312 קשה',     trend: 'down' as const, trendText: '-2.1% השבוע',       accent: 'orange' as const },
    { title: 'חולים מונשמים',          value: '45',        subtitle: 'מתוך 312 קשה',                                                              accent: 'teal'   as const },
    { title: 'נפטרים מצטבר',           value: '12,547',    subtitle: '+3 ב-24 שעות האחרונות',                                                     accent: 'purple' as const },
    { title: '% בדיקות חיוביות',       value: '3.2%',      subtitle: 'מתוך 38,210 בדיקות', trend: 'flat' as const, trendText: 'ללא שינוי',         accent: 'green'  as const },
    { title: 'מקדם הדבקה (R)',        value: '0.94',      subtitle: 'הערכה למוקדם השבוע', trend: 'down' as const, trendText: 'יורד',              accent: 'blue'   as const },
  ];

  /* ── Section 2: Cases curve ── */
  casesCurveOptions: Highcharts.Options = this.lineChart(
    ['1.1', '2.1', '3.1', '4.1', '5.1', '6.1', '7.1', '8.1', '9.1', '10.1', '11.1', '12.1', '13.1', '14.1'],
    [
      { name: 'מאומתים יומי',    data: [820, 910, 1100, 1240, 1180, 1320, 1450, 1390, 1500, 1480, 1410, 1380, 1290, 1245], color: '#50cbfd' },
      { name: 'ממוצע שבועי',     data: [780, 860, 990, 1180, 1210, 1300, 1380, 1420, 1450, 1470, 1450, 1410, 1360, 1310], color: '#ff7d67' },
    ],
  );

  casesByAgeOptions: Highcharts.Options = this.columnChart(
    ['0-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70+'],
    [{ name: 'מאומתים', data: [320, 540, 410, 380, 290, 210, 180], color: '#50cbfd' }],
  );

  /* ── Section 3: Tests ── */
  testsOptions: Highcharts.Options = this.lineChart(
    ['ש', 'א', 'ב', 'ג', 'ד', 'ה', 'ו'],
    [
      { name: 'PCR',     data: [12000, 18500, 22300, 24100, 25600, 26200, 14500], color: '#007f7f' },
      { name: 'אנטיגן',  data: [ 8500, 12300, 15200, 16400, 17800, 18100,  9200], color: '#baa1ef' },
    ],
  );

  testsPositiveOptions: Highcharts.Options = this.areaChart(
    ['ש', 'א', 'ב', 'ג', 'ד', 'ה', 'ו'],
    [{ name: '% חיוביות', data: [3.4, 3.2, 3.1, 3.0, 3.2, 3.3, 3.2], color: '#ff7d67' }],
    '%',
  );

  /* ── Section 4: Hospitalization ── */
  hospitalKpis = [
    { title: 'מאושפזים כיום',  value: '724', subtitle: '+12 ביממה',        accent: 'orange' as const },
    { title: 'חולים קשה',      value: '312', subtitle: 'מתוכם 45 מונשמים', accent: 'purple' as const },
    { title: 'מאושפזים בינוני', value: '198', subtitle: 'יציב',             accent: 'blue'   as const },
  ];

  hospitalTrendOptions: Highcharts.Options = this.lineChart(
    Array.from({ length: 14 }, (_, i) => `${i + 1}.1`),
    [
      { name: 'מאושפזים',  data: [540, 560, 590, 610, 640, 660, 680, 690, 705, 712, 720, 722, 720, 724], color: '#007f7f' },
      { name: 'חולים קשה', data: [220, 230, 245, 258, 270, 280, 288, 295, 300, 305, 308, 310, 311, 312], color: '#ff7d67' },
    ],
  );

  /* ── Section 5: Mortality ── */
  mortalityOptions: Highcharts.Options = this.columnChart(
    ['שב 1', 'שב 2', 'שב 3', 'שב 4', 'שב 5', 'שב 6', 'שב 7', 'שב 8'],
    [{ name: 'נפטרים שבועי', data: [38, 42, 35, 28, 24, 21, 19, 17], color: '#374f60' }],
  );

  mortalityKpis = [
    { title: 'נפטרים השבוע',  value: '17',     subtitle: 'מתוך 17,832 חולים', trend: 'down' as const, trendText: '-10%',  accent: 'purple' as const },
    { title: 'גיל חציוני',    value: '78',     subtitle: 'נפטרים אחרונים',                                                  accent: 'teal'   as const },
  ];

  /* ── Section 6: Vaccinations ── */
  vaxKpis = [
    { title: 'מנה ראשונה',  value: '6,920,114', subtitle: '76% מהאוכלוסייה', accent: 'green'  as const },
    { title: 'מנה שנייה',   value: '6,310,478', subtitle: '69%',             accent: 'blue'   as const },
    { title: 'מנה שלישית',  value: '4,650,211', subtitle: '51%',             accent: 'teal'   as const },
    { title: 'מנה רביעית',  value: '1,205,940', subtitle: '13%',             accent: 'purple' as const },
  ];

  vaxByAgeOptions: Highcharts.Options = this.stackedBarChart(
    ['12-15', '16-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70+'],
    [
      { name: 'מנה ראשונה', data: [72, 81, 78, 82, 86, 90, 94, 96], color: '#b6ca51' },
      { name: 'מנה שנייה',  data: [65, 76, 72, 78, 83, 88, 92, 94], color: '#50cbfd' },
      { name: 'מנה שלישית', data: [22, 41, 38, 49, 58, 71, 84, 88], color: '#007f7f' },
    ],
  );

  /* ── Section 7: Traffic light per city ── */
  trafficColumns: TableColumn[] = [
    { key: 'city',   label: 'יישוב' },
    { key: 'score',  label: 'ציון רמזור',     align: 'center' },
    { key: 'color',  label: 'צבע',            align: 'center' },
    { key: 'pos',    label: '% חיוביות',      align: 'center', format: 'percent' },
    { key: 'cases',  label: 'מאומתים השבוע',  align: 'center' },
  ];
  trafficRows = [
    { city: 'ירושלים',     score: 5.4, color: 'כתום',  pos: 4.1, cases: 412 },
    { city: 'תל אביב-יפו', score: 3.8, color: 'צהוב',  pos: 2.8, cases: 287 },
    { city: 'חיפה',        score: 2.9, color: 'ירוק',  pos: 2.1, cases: 132 },
    { city: 'באר שבע',     score: 4.3, color: 'צהוב',  pos: 3.4, cases: 184 },
    { city: 'בני ברק',     score: 6.7, color: 'אדום',  pos: 5.6, cases: 522 },
    { city: 'אשדוד',       score: 3.5, color: 'צהוב',  pos: 2.7, cases: 168 },
    { city: 'נתניה',       score: 3.1, color: 'ירוק',  pos: 2.4, cases: 142 },
    { city: 'ראשון לציון', score: 3.6, color: 'צהוב',  pos: 2.6, cases: 178 },
  ];

  /* ── Section 8: Variants ── */
  variantsOptions: Highcharts.Options = {
    chart: { type: 'pie' },
    title: { text: undefined },
    credits: { enabled: false },
    tooltip: { pointFormat: '<b>{point.percentage:.1f}%</b>' },
    plotOptions: {
      pie: {
        innerSize: '55%',
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.percentage:.0f}%',
          style: { fontFamily: 'Open Sans Hebrew', fontSize: '12px' },
        },
      },
    },
    series: [{
      type: 'pie',
      name: 'תפוצה',
      data: [
        { name: 'אומיקרון BA.2',   y: 58, color: '#50cbfd' },
        { name: 'אומיקרון BA.5',   y: 24, color: '#ff7d67' },
        { name: 'אומיקרון XBB',    y: 12, color: '#b6ca51' },
        { name: 'אחרים',           y:  6, color: '#baa1ef' },
      ],
    }],
  };

  /* ── Section 9: Isolation ── */
  isolationKpis = [
    { title: 'בבידוד כעת',           value: '34,210', subtitle: 'מתוכם 8,902 מאומתים', accent: 'blue'   as const },
    { title: 'בני בית מאומתים',      value: '12,540', subtitle: 'בבידוד מגע',          accent: 'orange' as const },
    { title: 'יצאו מבידוד אתמול',    value: '6,180',  subtitle: '',                    accent: 'green'  as const },
  ];

  isolationDurationOptions: Highcharts.Options = this.columnChart(
    ['יום 1', 'יום 2', 'יום 3', 'יום 4', 'יום 5', 'יום 6', 'יום 7+'],
    [{ name: 'יציאות מבידוד', data: [240, 410, 720, 1180, 1620, 1380, 630], color: '#baa1ef' }],
  );

  /* ── Highcharts helpers ── */
  private baseOptions(): Highcharts.Options {
    return {
      credits: { enabled: false },
      title: { text: undefined },
      legend: {
        itemStyle: { fontFamily: 'Open Sans Hebrew', fontWeight: '600', color: '#6b7891' },
        symbolRadius: 6,
      },
      xAxis: {
        labels: { style: { fontFamily: 'Open Sans Hebrew', color: '#6b7891' } },
        lineColor: '#e6ebf2',
        tickColor: '#e6ebf2',
      },
      yAxis: {
        title: { text: undefined },
        labels: { style: { fontFamily: 'Open Sans Hebrew', color: '#6b7891' } },
        gridLineColor: '#eef1f6',
      },
      tooltip: {
        useHTML: true,
        style: { fontFamily: 'Open Sans Hebrew' },
        shared: true,
      },
    };
  }

  private lineChart(categories: string[], series: { name: string; data: number[]; color: string }[]): Highcharts.Options {
    return {
      ...this.baseOptions(),
      chart: { type: 'line' },
      xAxis: { ...this.baseOptions().xAxis, categories, reversed: true },
      series: series.map(s => ({ type: 'line', ...s, marker: { enabled: false } })),
    };
  }

  private columnChart(categories: string[], series: { name: string; data: number[]; color: string }[]): Highcharts.Options {
    return {
      ...this.baseOptions(),
      chart: { type: 'column' },
      xAxis: { ...this.baseOptions().xAxis, categories, reversed: true },
      plotOptions: { column: { borderRadius: 3, pointPadding: 0.1, groupPadding: 0.12 } },
      series: series.map(s => ({ type: 'column', ...s })),
    };
  }

  private areaChart(categories: string[], series: { name: string; data: number[]; color: string }[], suffix = ''): Highcharts.Options {
    return {
      ...this.baseOptions(),
      chart: { type: 'area' },
      xAxis: { ...this.baseOptions().xAxis, categories, reversed: true },
      yAxis: { ...this.baseOptions().yAxis, labels: { format: '{value}' + suffix, style: { fontFamily: 'Open Sans Hebrew', color: '#6b7891' } } },
      series: series.map(s => ({ type: 'area', ...s, fillOpacity: 0.25, marker: { enabled: false } })),
    };
  }

  private stackedBarChart(categories: string[], series: { name: string; data: number[]; color: string }[]): Highcharts.Options {
    return {
      ...this.baseOptions(),
      chart: { type: 'bar' },
      xAxis: { ...this.baseOptions().xAxis, categories },
      yAxis: { ...this.baseOptions().yAxis, max: 100, labels: { format: '{value}%', style: { fontFamily: 'Open Sans Hebrew', color: '#6b7891' } } },
      plotOptions: { bar: { borderRadius: 3 } },
      series: series.map(s => ({ type: 'bar', ...s })),
    };
  }
}
