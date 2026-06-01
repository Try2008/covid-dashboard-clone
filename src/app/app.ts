import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { Header } from './components/header/header';
import { Navbar } from './components/navbar/navbar';
import { SideMenu } from './components/side-menu/side-menu';
import { KpiCardComponent } from './components/overview/overview';
import { KpiSlimCard } from './components/kpi-slim-card/kpi-slim-card';
import { ChartCardComponent, LegendItem } from './components/charts/charts';
import { AppState } from './services/app-state';

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
  readonly app = inject(AppState);

  private t(he: string, en: string): string {
    return this.app.t(he, en);
  }

  /* ════════ Static labels ════════ */
  get breadcrumbRoot() { return this.t('עולם הדאטה', 'Data World'); }
  get breadcrumbCurrent() { return this.t('קורונה', 'Coronavirus'); }
  get pageTitle() { return this.t('קורונה', 'Coronavirus'); }
  get linksBtnLabel() { return this.t('לינקים בנושא', 'Related links'); }
  get sevenDaySummaryHeader() { return this.t('סיכום 7 ימים אחרונים', 'Last 7-day summary'); }

  get sectionOverview()           { return this.t('מבט על', 'Overview'); }
  get sectionMainIndicators()     { return this.t('מדדים מרכזיים', 'Key indicators'); }
  get sectionChildren()           { return this.t('תחלואה ואשפוזי ילדים', 'Child morbidity and hospitalizations'); }
  get sectionVaccinationEffect()  { return this.t('השפעת התחסנות על התחלואה', 'Effect of vaccination on morbidity'); }
  get sectionDeceased()           { return this.t('נפטרים', 'Deaths'); }
  get sectionTests()              { return this.t('בדיקות', 'Tests'); }
  get sectionInvestigations()     { return this.t('תחקורים נוספים', 'Further investigations'); }
  get sectionRecovered()          { return this.t('תחלואה חוזרת ומחלימים', 'Reinfections and recoveries'); }
  get sectionVaccination()        { return this.t('התחסנות האוכלוסיה', 'Population vaccination'); }

  /* ════════ Section 1: מבט על ════════ */
  readonly overviewKpis = computed(() => {
    const _ = this.app.lang();
    return [
      {
        title: this.t('מאומתים אתמול', 'Confirmed yesterday'),
        mainValue: '0',
        subRows: [
          { label: this.t('מחצות', 'Since midnight'), value: '0' },
          { label: this.t('סה"כ', 'Total'),            value: '4,863,945' },
        ],
      },
      {
        title: this.t('חולים פעילים', 'Active cases'),
        mainValue: '361',
        subRows: [
          { label: this.t('בבי"ח', 'Hospitalized'), value: '196' },
        ],
      },
      {
        title: this.t('מתחסנים', 'Vaccinated'),
        mainValue: null,
        subRows: [
          { label: this.t('מנה 1',    'Dose 1'),     value: '6,722,627' },
          { label: this.t('מנה 2',    'Dose 2'),     value: '6,006,974' },
          { label: this.t('מנה 3',    'Dose 3'),     value: '3,854,872' },
          { label: this.t('מנה 4',    'Dose 4'),     value: '474,534' },
          { label: this.t('אומיקרון', 'Omicron'),    value: '407,432' },
        ],
      },
      {
        title: this.t('נפטרים מצטבר', 'Cumulative deaths'),
        mainValue: '13,174',
        subRows: [],
      },
      {
        title: this.t('אחוז נבדקים חיוביים אתמול', 'Positive test % yesterday'),
        mainValue: '0%',
        subRows: [
          { label: this.t('נבדקים לגילוי הנגיף אתמול', 'Diagnostic tests yesterday'), value: '84' },
          { label: this.t('כלל הבדיקות אתמול',         'Total tests yesterday'),     value: '92' },
        ],
      },
    ];
  });

  readonly weekSummary = computed(() => {
    const _ = this.app.lang();
    const fromPrev = this.t('משבעה ימים קודמים', 'vs. previous 7 days');
    return [
      { title: this.t('מספר המאומתים', 'Confirmed cases'), value: '40',    change: '-28.6%', subtitle: fromPrev, extra: '' },
      { title: this.t('מספר נפטרים',   'Deaths'),          value: '0',     change: '0%',     subtitle: fromPrev, extra: '' },
      { title: this.t('מספר נבדקים',   'Tested'),          value: '2,257', change: '-11.4%', subtitle: fromPrev, extra: this.t('1.8% נבדקים חיוביים', '1.8% positive') },
    ];
  });

  /* ════════ Filter & misc labels (used as inputs to chart cards) ════════ */
  get filterMonth() { return this.t('חודש אחרון', 'Last month'); }
  get filterVaxEffectAge60All() { return this.t('ל-100 אלף תושבים, מעל גיל 60, עד עכשיו', 'per 100K, age 60+, to date'); }
  get filterVaxEffectAge60Month() { return this.t('ל-100 אלף תושבים, מעל גיל 60, חודש אחרון', 'per 100K, age 60+, last month'); }
  get filterRecurrentAge() { return this.t('מספר המאומתים בקבוצת הגיל, חודש אחרון', 'Confirmed cases in age group, last month'); }
  get filterVaxCumulative() { return this.t('מצב התחסנות, אחוז, חודש אחרון', 'Vaccination status, percent, last month'); }
  get filterVaxStatus() { return this.t('מצב התחסנות', 'Vaccination status'); }
  get filterToday() { return this.t('היום', 'Today'); }

  get noteNoRecovery() { return this.t('הנתונים אינם כוללים מידע על בדיקות לאבחון החלמה', 'Data does not include tests for recovery diagnosis'); }
  get noteRecurrentShare() { return this.t('החולים בתחלואה חוזרת מהווים 8.7% מסך כל המחלימים', 'Reinfections make up 8.7% of all recoveries'); }

  /* ════════ Section 2: chart titles ════════ */
  get titleWeeklyCasesAvg() { return this.t('ממוצע מאומתים שבועי', 'Weekly confirmed average'); }
  get titleNewCasesDaily()  { return this.t('מאומתים חדשים יומי', 'New confirmed cases - daily'); }
  get titleChildrenTrend()  { return this.t('מגמת ילדים מאומתים – ממוצע נע 7 ימים', 'Confirmed children trend - 7-day moving avg'); }
  get titleVaxEffectCases() { return this.t('מאומתים יומי - התחסנות', 'Daily confirmed - by vaccination'); }
  get titleDeceasedDaily()  { return this.t('נפטרים - יומי', 'Deaths - daily'); }
  get titleDeceasedByVax()  { return this.t('נפטרים יומי – מצב התחסנות', 'Daily deaths - vaccination status'); }
  get titlePositivePct()    { return this.t('אחוז נבדקים חיוביים', 'Positive test %'); }
  get titleTestsDaily()     { return this.t('מספר בדיקות קורונה - יומי', 'Daily test count'); }
  get titleTestsByAge()     { return this.t('מספר נבדקים לפי קבוצות גיל', 'Tested by age groups'); }
  get titleInvestigations() { return this.t('תחקור תחלואה לאור אירועים והתחסנות', 'Morbidity investigation by events & vaccination'); }
  get titleRecurrentByAge() { return this.t('תחלואה חוזרת - גיל והתחסנות', 'Reinfections - age & vaccination'); }
  get titleRecurrentDaily() { return this.t('תחלואה חוזרת לפי התחסנות - יומי', 'Reinfections by vaccination - daily'); }
  get titleRecoveredDaily() { return this.t('מחלימים יומי', 'Daily recoveries'); }
  get titleVaxDaily()       { return this.t('מספר התחסנויות - יומי', 'Daily vaccinations'); }
  get titleVaxCumulative()  { return this.t('מתחסנים מצטבר', 'Cumulative vaccinated'); }
  get titleVaxByAge()       { return this.t('אחוז מתחסנים לפי קבוצות גיל', 'Vaccination % by age group'); }

  /* ════════ Chart data ════════ */
  private monthDates = dailyDates(18, 4, 29);  // 18.04 → 16.05

  readonly weeklyCasesAvgOptions = computed<Highcharts.Options>(() => this.column(
    ['26.04-02.05', '03.05-09.05', '10.05-16.05'],
    [{ name: this.t('ממוצע', 'Average'), data: [7, 8, 5], color: C.blue }],
    { yMax: 10, reverseX: true, hideLegend: true },
  ));
  readonly weeklyCasesAvgOptions2 = this.weeklyCasesAvgOptions;

  readonly newCasesDailyOptions = computed<Highcharts.Options>(() => this.comboBarLine(
    this.monthDates,
    {
      bar:  { name: this.t('מאומתים חדשים',    'New confirmed'),         data: this.noisySeries(29, 1, 0.6),  color: C.blue },
      line: { name: this.t('ממוצע נע מאומתים', 'Moving avg - confirmed'), data: this.smoothSeries(29, 1.1, 0.3), color: C.orange },
    },
    { reverseX: true },
  ));
  readonly newCasesLegend = computed<LegendItem[]>(() => [
    { label: this.t('מאומתים חדשים',    'New confirmed'),         color: C.blue },
    { label: this.t('ממוצע נע מאומתים', 'Moving avg - confirmed'), color: C.orange },
  ]);

  readonly childrenTrendOptions = computed<Highcharts.Options>(() => this.multiLine(
    this.monthDates,
    [
      { name: '0-4',   data: this.smoothSeries(29, 0.30, 0.18), color: C.blue },
      { name: '5-11',  data: this.smoothSeries(29, 0.45, 0.22), color: C.green },
      { name: '12-15', data: this.smoothSeries(29, 0.20, 0.15), color: C.teal },
      { name: '16-19', data: this.smoothSeries(29, 0.35, 0.20), color: C.purple },
    ],
    { reverseX: true, yMax: 1 },
  ));
  readonly childrenLegend: LegendItem[] = [
    { label: '0-4',   color: C.blue },
    { label: '5-11',  color: C.green },
    { label: '12-15', color: C.teal },
    { label: '16-19', color: C.purple },
  ];

  readonly vaxEffectCasesOptions = computed<Highcharts.Options>(() => this.multiLine(
    this.monthDates,
    [
      { name: this.t('לא מחוסנים',       'Unvaccinated'),       data: this.smoothSeries(29, 540, 90), color: C.blue },
      { name: this.t('מחוסנים ללא תוקף', 'Expired vaccination'), data: this.smoothSeries(29, 320, 60), color: C.green },
      { name: this.t('מחוסנים',          'Vaccinated'),         data: this.smoothSeries(29, 140, 40), color: C.teal },
    ],
    { reverseX: true, yMax: 750 },
  ));
  readonly vaxEffectLegend = computed<LegendItem[]>(() => [
    { label: this.t('לא מחוסנים',       'Unvaccinated'),       color: C.blue },
    { label: this.t('מחוסנים ללא תוקף', 'Expired vaccination'), color: C.green },
    { label: this.t('מחוסנים',          'Vaccinated'),         color: C.teal },
  ]);

  readonly deceasedDailyOptions = computed<Highcharts.Options>(() => this.comboBarLine(
    this.monthDates,
    {
      bar:  { name: this.t('נפטרים',          'Deaths'),                 data: this.noisySeries(29, 0.7, 0.4), color: C.teal },
      line: { name: this.t('ממוצע נע נפטרים', 'Moving avg - deaths'),    data: this.smoothSeries(29, 0.8, 0.25), color: C.orange },
    },
    { reverseX: true },
  ));
  readonly deceasedLegend = computed<LegendItem[]>(() => [
    { label: this.t('נפטרים',          'Deaths'),              color: C.teal },
    { label: this.t('ממוצע נע נפטרים', 'Moving avg - deaths'), color: C.orange },
  ]);

  readonly deceasedByVaxOptions = computed<Highcharts.Options>(() => this.multiLine(
    this.monthDates,
    [
      { name: this.t('לא מחוסנים',       'Unvaccinated'),       data: this.smoothSeries(29, 0.32, 0.06), color: C.blue },
      { name: this.t('מחוסנים ללא תוקף', 'Expired vaccination'), data: this.smoothSeries(29, 0.18, 0.04), color: C.green },
      { name: this.t('מחוסנים',          'Vaccinated'),         data: this.smoothSeries(29, 0.07, 0.02), color: C.teal },
    ],
    { reverseX: true, yMax: 0.5 },
  ));
  readonly deceasedByVaxLegend = this.vaxEffectLegend;

  readonly positivePctOptions = computed<Highcharts.Options>(() => this.multiLine(
    this.monthDates,
    [
      { name: this.t('חיוביים בPCR',          'Positive - PCR'),               data: this.smoothSeries(29, 2.2, 0.6), color: C.blue },
      { name: this.t('חיוביים באנטיגן מוסדי', 'Positive - institutional antigen'), data: this.smoothSeries(29, 1.4, 0.5), color: C.green },
    ],
    { reverseX: true, yMax: 10, ySuffix: '%' },
  ));
  readonly positivePctLegend = computed<LegendItem[]>(() => [
    { label: this.t('חיוביים בPCR',          'Positive - PCR'),                  color: C.blue },
    { label: this.t('חיוביים באנטיגן מוסדי', 'Positive - institutional antigen'), color: C.green },
  ]);

  readonly testsDailyOptions = computed<Highcharts.Options>(() => this.stackedBarWithLine(
    this.monthDates,
    [
      { name: this.t('בדיקות PCR',  'PCR tests'),            data: this.noisySeries(29, 1800, 600), color: C.blue },
      { name: this.t('אנטיגן מוסדי', 'Institutional antigen'), data: this.noisySeries(29, 900,  300), color: C.green },
    ],
    { name: this.t('ממוצע נע סך הבדיקות', 'Moving avg - total tests'), data: this.smoothSeries(29, 2700, 600), color: C.orange },
    { reverseX: true },
  ));
  readonly testsLegend = computed<LegendItem[]>(() => [
    { label: this.t('בדיקות PCR',        'PCR tests'),               color: C.blue },
    { label: this.t('אנטיגן מוסדי',      'Institutional antigen'),   color: C.green },
    { label: this.t('ממוצע נע סך הבדיקות','Moving avg - total tests'), color: C.orange },
  ]);

  readonly testsByAgeOptions = computed<Highcharts.Options>(() => this.groupedColumn(
    ['0-4', '5-11', '12-15', '16-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70+'],
    [
      { name: this.t('נבדקים',         'Tested'),          data: [180, 420, 260, 290, 510, 480, 410, 350, 280, 220], color: C.blue },
      { name: this.t('נבדקים חיוביים', 'Tested positive'), data: [  3,   7,   5,   6,  10,   9,   8,   6,   4,   3], color: C.teal },
    ],
  ));
  readonly testsByAgeLegend = computed<LegendItem[]>(() => [
    { label: this.t('נבדקים',         'Tested'),          color: C.blue },
    { label: this.t('נבדקים חיוביים', 'Tested positive'), color: C.teal },
  ]);

  readonly investigationsTimelineOptions = computed<Highcharts.Options>(() => this.comboBarPercent(
    this.monthDates,
    { name: this.t('מאומתים',          'Confirmed'),                     data: this.noisySeries(29, 8, 4),  color: C.blue, axis: 0 },
    { name: this.t('% מחוסנים מצטבר',  '% cumulative vaccinated'),       data: this.cumulativePercent(29, 72, 76), color: C.teal, axis: 1 },
    { reverseX: true },
  ));
  readonly investigationsLegend = computed<LegendItem[]>(() => [
    { label: this.t('% מחוסנים מצטבר', '% cumulative vaccinated'), color: C.teal },
    { label: this.t('מאומתים',         'Confirmed'),               color: C.blue },
  ]);

  readonly recurrentByAgeOptions = computed<Highcharts.Options>(() => this.horizontalGrouped(
    ['16-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80+'],
    [
      { name: this.t('לא מחוסנים', 'Unvaccinated'), data: [ 24,  82,  61,  44,  31,  22,  14,  9 ], color: C.blue },
      { name: this.t('מחוסנים',    'Vaccinated'),   data: [ 41, 138, 102,  74,  53,  37,  21, 12 ], color: C.teal },
    ],
  ));
  readonly recurrentByAgeLegend = computed<LegendItem[]>(() => [
    { label: this.t('לא מחוסנים', 'Unvaccinated'), color: C.blue },
    { label: this.t('מחוסנים',    'Vaccinated'),   color: C.teal },
  ]);

  readonly recurrentDailyOptions = computed<Highcharts.Options>(() => this.stackedBarWithLine(
    this.monthDates,
    [
      { name: this.t('לא מחוסנים', 'Unvaccinated'), data: this.noisySeries(29, 4, 2), color: C.blue },
      { name: this.t('מחוסנים',    'Vaccinated'),   data: this.noisySeries(29, 7, 3), color: C.teal },
    ],
    { name: this.t('ממוצע נע סך מאומתים', 'Moving avg - total confirmed'), data: this.smoothSeries(29, 11, 3), color: C.orange },
    { reverseX: true },
  ));
  readonly recurrentDailyLegend = computed<LegendItem[]>(() => [
    { label: this.t('לא מחוסנים',           'Unvaccinated'),                color: C.blue },
    { label: this.t('מחוסנים',              'Vaccinated'),                  color: C.teal },
    { label: this.t('ממוצע נע סך מאומתים', 'Moving avg - total confirmed'), color: C.orange },
  ]);

  readonly recoveredDailyOptions = computed<Highcharts.Options>(() => this.comboBarLine(
    this.monthDates,
    {
      bar:  { name: this.t('מחלימים',          'Recoveries'),              data: this.noisySeries(29, 28, 12), color: C.teal },
      line: { name: this.t('ממוצע נע מחלימים', 'Moving avg - recoveries'), data: this.smoothSeries(29, 30, 6), color: C.orange },
    },
    { reverseX: true },
  ));
  readonly recoveredLegend = computed<LegendItem[]>(() => [
    { label: this.t('מחלימים',          'Recoveries'),              color: C.teal },
    { label: this.t('ממוצע נע מחלימים', 'Moving avg - recoveries'), color: C.orange },
  ]);

  readonly vaxDailyOptions = computed<Highcharts.Options>(() => this.stackedColumn(
    this.monthDates,
    [
      { name: this.t('מנה 1', 'Dose 1'), data: this.noisySeries(29, 110, 40), color: C.blue },
      { name: this.t('מנה 2', 'Dose 2'), data: this.noisySeries(29,  80, 30), color: C.green },
      { name: this.t('מנה 3', 'Dose 3'), data: this.noisySeries(29,  60, 25), color: C.teal },
      { name: this.t('מנה 4', 'Dose 4'), data: this.noisySeries(29,  35, 20), color: C.purple },
    ],
    { reverseX: true },
  ));
  readonly vaxDailyLegend = computed<LegendItem[]>(() => [
    { label: this.t('מנה 1', 'Dose 1'), color: C.blue },
    { label: this.t('מנה 2', 'Dose 2'), color: C.green },
    { label: this.t('מנה 3', 'Dose 3'), color: C.teal },
    { label: this.t('מנה 4', 'Dose 4'), color: C.purple },
  ]);

  readonly vaxCumulativeOptions = computed<Highcharts.Options>(() => this.stackedArea(
    this.monthDates,
    [
      { name: this.t('לא מחוסנים',       'Unvaccinated'),       data: this.smoothSeries(29, 22, 1), color: C.blue },
      { name: this.t('מחוסנים ללא תוקף', 'Expired vaccination'), data: this.smoothSeries(29, 28, 1), color: C.green },
      { name: this.t('מחוסנים',          'Vaccinated'),         data: this.smoothSeries(29, 50, 1), color: C.teal },
    ],
    { reverseX: true, yMax: 100, ySuffix: '%' },
  ));
  readonly vaxCumulativeLegend = this.vaxEffectLegend;

  readonly vaxByAgeOptions = computed<Highcharts.Options>(() => this.horizontalStacked(
    ['0-4', '5-11', '12-15', '16-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70+'],
    [
      { name: this.t('לא מחוסנים',       'Unvaccinated'),       data: [98, 56, 28, 22, 24, 18, 14, 10,  6,  4], color: C.blue },
      { name: this.t('מחוסנים ללא תוקף', 'Expired vaccination'), data: [ 2, 28, 36, 32, 30, 26, 22, 18, 12,  8], color: C.green },
      { name: this.t('מחוסנים',          'Vaccinated'),         data: [ 0, 16, 36, 46, 46, 56, 64, 72, 82, 88], color: C.teal },
    ],
    { ySuffix: '%' },
  ));
  readonly vaxByAgeLegend = this.vaxEffectLegend;

  /* ════════ Highcharts builder helpers ════════ */

  private base(): Highcharts.Options {
    const dark = this.app.dark();
    const axisLine  = dark ? '#2a3340' : '#e6ebf2';
    const gridLine  = dark ? '#2a3340' : '#eef1f6';
    const labelColor = dark ? '#8b95a6' : '#8794a3';
    const bg        = dark ? '#1c2330' : '#ffffff';
    return {
      credits: { enabled: false },
      title:   { text: undefined },
      legend:  { enabled: false },
      chart:   { backgroundColor: bg },
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: bg,
        style: { fontFamily: 'Open Sans Hebrew', color: dark ? '#e6edf5' : '#222b45' },
      },
      xAxis: {
        lineColor: axisLine,
        tickColor: axisLine,
        labels: { style: { fontFamily: 'Open Sans Hebrew', color: labelColor, fontSize: '11px' } },
      },
      yAxis: {
        title: { text: undefined },
        gridLineColor: gridLine,
        labels: { style: { fontFamily: 'Open Sans Hebrew', color: labelColor, fontSize: '11px' } },
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
