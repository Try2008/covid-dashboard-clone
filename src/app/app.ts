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
import { CovidData } from './services/covid-data';

const C = {
  blue:   '#50cbfd',
  orange: '#ff7d67',
  green:  '#b6ca51',
  teal:   '#007f7f',
  purple: '#baa1ef',
};

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
  readonly data = inject(CovidData);

  private t(he: string, en: string): string {
    return this.app.t(he, en);
  }

  /* ════════ Static labels ════════ */
  get breadcrumbRoot() { return this.t('עולם הדאטה', 'Data World'); }
  get breadcrumbCurrent() { return this.t('קורונה', 'Coronavirus'); }
  get pageTitle() { return this.t('קורונה', 'Coronavirus'); }
  get linksBtnLabel() { return this.t('לינקים בנושא', 'Related links'); }
  get sevenDaySummaryHeader() { return this.t('סיכום 7 ימים אחרונים', 'Last 7-day summary'); }
  get lastUpdatedLabel() { return this.data.lastUpdatedLabel; }

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
  get filterAll() { return this.t('עד עכשיו', 'To date'); }
  get filterVaxEffectAge60All() { return this.t('ל-100 אלף תושבים, מעל גיל 60, עד עכשיו', 'per 100K, age 60+, to date'); }
  get filterRecurrentAge() { return this.t('מספר המאומתים בקבוצת הגיל, חודש אחרון', 'Confirmed cases in age group, last month'); }
  get filterVaxCumulative() { return this.t('מצב התחסנות, אחוז, עד עכשיו', 'Vaccination status, percent, to date'); }
  get filterVaxStatus() { return this.t('מצב התחסנות', 'Vaccination status'); }

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

  /* ════════ Chart data (sourced from the CovidData snapshot) ════════ */
  private get cats() { return this.data.cats; }

  readonly weeklyCasesAvgOptions = computed<Highcharts.Options>(() => this.column(
    this.data.weeklyAvgCats,
    [{ name: this.t('ממוצע', 'Average'), data: this.data.weeklyAvgVals, color: C.blue }],
    { reverseX: true, hideLegend: true },
  ));
  readonly weeklyCasesAvgOptions2 = this.weeklyCasesAvgOptions;

  readonly newCasesDailyOptions = computed<Highcharts.Options>(() => this.comboBarLine(
    this.cats,
    {
      bar:  { name: this.t('מאומתים חדשים',    'New confirmed'),         data: this.data.confirmed,                       color: C.blue },
      line: { name: this.t('ממוצע נע מאומתים', 'Moving avg - confirmed'), data: this.data.movingAvg(this.data.confirmed), color: C.orange },
    },
    { reverseX: true },
  ));
  readonly newCasesLegend = computed<LegendItem[]>(() => [
    { label: this.t('מאומתים חדשים',    'New confirmed'),         color: C.blue },
    { label: this.t('ממוצע נע מאומתים', 'Moving avg - confirmed'), color: C.orange },
  ]);

  readonly childrenTrendOptions = computed<Highcharts.Options>(() => this.multiLine(
    this.cats,
    [
      { name: '0-4',   data: this.data.children.a04,   color: C.blue },
      { name: '5-11',  data: this.data.children.a511,  color: C.green },
      { name: '12-15', data: this.data.children.a1215, color: C.teal },
      { name: '16-19', data: this.data.children.a1619, color: C.purple },
    ],
    { reverseX: true },
  ));
  readonly childrenLegend: LegendItem[] = [
    { label: '0-4',   color: C.blue },
    { label: '5-11',  color: C.green },
    { label: '12-15', color: C.teal },
    { label: '16-19', color: C.purple },
  ];

  readonly vaxEffectCasesOptions = computed<Highcharts.Options>(() => this.multiLine(
    this.cats,
    [
      { name: this.t('לא מחוסנים',       'Unvaccinated'),       data: this.data.vaxEffUnvax,   color: C.blue },
      { name: this.t('מחוסנים ללא תוקף', 'Expired vaccination'), data: this.data.vaxEffExpired, color: C.green },
      { name: this.t('מחוסנים',          'Vaccinated'),         data: this.data.vaxEffVax,     color: C.teal },
    ],
    { reverseX: true },
  ));
  readonly vaxEffectLegend = computed<LegendItem[]>(() => [
    { label: this.t('לא מחוסנים',       'Unvaccinated'),       color: C.blue },
    { label: this.t('מחוסנים ללא תוקף', 'Expired vaccination'), color: C.green },
    { label: this.t('מחוסנים',          'Vaccinated'),         color: C.teal },
  ]);

  readonly deceasedDailyOptions = computed<Highcharts.Options>(() => this.comboBarLine(
    this.cats,
    {
      bar:  { name: this.t('נפטרים',          'Deaths'),              data: this.data.deaths,                       color: C.teal },
      line: { name: this.t('ממוצע נע נפטרים', 'Moving avg - deaths'), data: this.data.movingAvg(this.data.deaths), color: C.orange },
    },
    { reverseX: true },
  ));
  readonly deceasedLegend = computed<LegendItem[]>(() => [
    { label: this.t('נפטרים',          'Deaths'),              color: C.teal },
    { label: this.t('ממוצע נע נפטרים', 'Moving avg - deaths'), color: C.orange },
  ]);

  readonly deceasedByVaxOptions = computed<Highcharts.Options>(() => this.multiLine(
    this.cats,
    [
      { name: this.t('לא מחוסנים',       'Unvaccinated'),       data: this.data.deathVaxUnvax,   color: C.blue },
      { name: this.t('מחוסנים ללא תוקף', 'Expired vaccination'), data: this.data.deathVaxExpired, color: C.green },
      { name: this.t('מחוסנים',          'Vaccinated'),         data: this.data.deathVaxVax,     color: C.teal },
    ],
    { reverseX: true },
  ));
  readonly deceasedByVaxLegend = this.vaxEffectLegend;

  readonly positivePctOptions = computed<Highcharts.Options>(() => this.multiLine(
    this.cats,
    [
      { name: this.t('חיוביים בPCR',          'Positive - PCR'),               data: this.data.posPCR,     color: C.blue },
      { name: this.t('חיוביים באנטיגן מוסדי', 'Positive - institutional antigen'), data: this.data.posAntigen, color: C.green },
    ],
    { reverseX: true, ySuffix: '%' },
  ));
  readonly positivePctLegend = computed<LegendItem[]>(() => [
    { label: this.t('חיוביים בPCR',          'Positive - PCR'),                  color: C.blue },
    { label: this.t('חיוביים באנטיגן מוסדי', 'Positive - institutional antigen'), color: C.green },
  ]);

  readonly testsDailyOptions = computed<Highcharts.Options>(() => this.stackedBarWithLine(
    this.cats,
    [
      { name: this.t('בדיקות PCR',  'PCR tests'),            data: this.data.testsPCR,     color: C.blue },
      { name: this.t('אנטיגן מוסדי', 'Institutional antigen'), data: this.data.testsAntigen, color: C.green },
    ],
    { name: this.t('ממוצע נע סך הבדיקות', 'Moving avg - total tests'), data: this.data.movingAvg(this.data.testsTotal), color: C.orange },
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
    this.cats,
    { name: this.t('מאומתים',          'Confirmed'),                     data: this.data.confirmed, color: C.blue, axis: 0 },
    { name: this.t('% מחוסנים מצטבר',  '% cumulative vaccinated'),       data: this.data.cumVaxPct, color: C.teal, axis: 1 },
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

  readonly recurrentDailyOptions = computed<Highcharts.Options>(() => {
    const total = this.data.reinfUnvax.map((v, i) => v + this.data.reinfVax[i]);
    return this.stackedBarWithLine(
      this.cats,
      [
        { name: this.t('לא מחוסנים', 'Unvaccinated'), data: this.data.reinfUnvax, color: C.blue },
        { name: this.t('מחוסנים',    'Vaccinated'),   data: this.data.reinfVax,   color: C.teal },
      ],
      { name: this.t('ממוצע נע סך מאומתים', 'Moving avg - total confirmed'), data: this.data.movingAvg(total), color: C.orange },
      { reverseX: true },
    );
  });
  readonly recurrentDailyLegend = computed<LegendItem[]>(() => [
    { label: this.t('לא מחוסנים',           'Unvaccinated'),                color: C.blue },
    { label: this.t('מחוסנים',              'Vaccinated'),                  color: C.teal },
    { label: this.t('ממוצע נע סך מאומתים', 'Moving avg - total confirmed'), color: C.orange },
  ]);

  readonly recoveredDailyOptions = computed<Highcharts.Options>(() => this.comboBarLine(
    this.cats,
    {
      bar:  { name: this.t('מחלימים',          'Recoveries'),              data: this.data.recoveries,                       color: C.teal },
      line: { name: this.t('ממוצע נע מחלימים', 'Moving avg - recoveries'), data: this.data.movingAvg(this.data.recoveries), color: C.orange },
    },
    { reverseX: true },
  ));
  readonly recoveredLegend = computed<LegendItem[]>(() => [
    { label: this.t('מחלימים',          'Recoveries'),              color: C.teal },
    { label: this.t('ממוצע נע מחלימים', 'Moving avg - recoveries'), color: C.orange },
  ]);

  readonly vaxDailyOptions = computed<Highcharts.Options>(() => this.stackedColumn(
    this.cats,
    [
      { name: this.t('מנה 1', 'Dose 1'), data: this.data.dose1, color: C.blue },
      { name: this.t('מנה 2', 'Dose 2'), data: this.data.dose2, color: C.green },
      { name: this.t('מנה 3', 'Dose 3'), data: this.data.dose3, color: C.teal },
      { name: this.t('מנה 4', 'Dose 4'), data: this.data.dose4, color: C.purple },
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
    this.cats,
    [
      { name: this.t('לא מחוסנים',       'Unvaccinated'),       data: this.data.shareUnvax,   color: C.blue },
      { name: this.t('מחוסנים ללא תוקף', 'Expired vaccination'), data: this.data.shareExpired, color: C.green },
      { name: this.t('מחוסנים',          'Vaccinated'),         data: this.data.shareVax,     color: C.teal },
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

  private chartBg(): string {
    return this.app.dark() ? '#1c2330' : '#ffffff';
  }

  /** Chart-level options shared by every builder (preserves theme bg, no anim). */
  private chartOpts(type: string): Highcharts.ChartOptions {
    return { type: type as Highcharts.ChartOptions['type'], backgroundColor: this.chartBg(), animation: false };
  }

  private base(): Highcharts.Options {
    const dark = this.app.dark();
    const axisLine  = dark ? '#2a3340' : '#e6ebf2';
    const gridLine  = dark ? '#2a3340' : '#eef1f6';
    const labelColor = dark ? '#8b95a6' : '#8794a3';
    const bg        = this.chartBg();
    return {
      credits: { enabled: false },
      title:   { text: undefined },
      legend:  { enabled: false },
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
      chart: this.chartOpts('column'),
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
      chart: this.chartOpts('line'),
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
      chart: this.chartOpts('column'),
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
      chart: this.chartOpts('column'),
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
      chart: this.chartOpts('column'),
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
      chart: this.chartOpts('column'),
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
      chart: this.chartOpts('column'),
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
      chart: this.chartOpts('bar'),
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
      chart: this.chartOpts('bar'),
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
      chart: this.chartOpts('area'),
      xAxis: this.xAxis(categories, !!o.reverseX),
      yAxis: this.yAxisOpts(o.yMax, o.ySuffix ?? ''),
      plotOptions: { area: { stacking: 'percent', fillOpacity: 0.55, lineWidth: 1, marker: { enabled: false } } },
      series: series.map(s => ({ type: 'area', ...s })),
    };
  }
}
