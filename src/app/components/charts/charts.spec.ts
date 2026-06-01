import { TestBed } from '@angular/core/testing';
import { provideHighcharts } from 'highcharts-angular';

import { ChartCardComponent } from './charts';

/** Build N day-of-month labels in the DD.MM.YY format the filter recognises. */
function dateLabels(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `${String((i % 28) + 1).padStart(2, '0')}.01.22`);
}

describe('ChartCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartCardComponent],
      providers: [provideHighcharts({ instance: () => import('highcharts') })],
    }).compileComponents();
  });

  function build(options: any, filterLabel = ''): ChartCardComponent {
    const fixture = TestBed.createComponent(ChartCardComponent);
    const c = fixture.componentInstance;
    c.title = 'test';
    c.options = options;
    c.filterLabel = filterLabel;
    c.ngOnInit();
    return c;
  }

  const cats = (c: ChartCardComponent) => (c.currentOptions.xAxis as any).categories as string[];
  const data = (c: ChartCardComponent) => (c.currentOptions.series as any[])[0].data as number[];

  it('should create', () => {
    const c = build(
      { xAxis: { categories: dateLabels(120) }, series: [{ type: 'column', data: Array.from({ length: 120 }, (_, i) => i) }] },
      'עד עכשיו',
    );
    expect(c).toBeTruthy();
  });

  it('slices a date series differently for week / month / all', () => {
    const c = build(
      { xAxis: { categories: dateLabels(120) }, series: [{ type: 'column', data: Array.from({ length: 120 }, (_, i) => i) }] },
      'עד עכשיו',
    );
    expect(cats(c).length).toBe(120); // default "to date"

    c.selectOption({ label: 'week', value: 'week' as any });
    expect(cats(c).length).toBe(7);

    c.selectOption({ label: 'month', value: 'month' as any });
    expect(cats(c).length).toBe(30);

    c.selectOption({ label: 'all', value: 'all' as any });
    expect(cats(c).length).toBe(120);
  });

  it('leaves a static (non-date) category series unchanged across ranges', () => {
    const c = build(
      {
        xAxis: { categories: ['0-4', '5-11', '12-15', '16-19', '20-29', '30-39'] },
        series: [{ type: 'column', data: [1, 2, 3, 4, 5, 6] }],
      },
      'חודש אחרון',
    );

    c.selectOption({ label: 'week', value: 'week' as any });
    expect(data(c)).toEqual([1, 2, 3, 4, 5, 6]);

    c.selectOption({ label: 'all', value: 'all' as any });
    expect(data(c)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
