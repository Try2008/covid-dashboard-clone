import { TestBed } from '@angular/core/testing';

import { CovidData } from './covid-data';

describe('CovidData', () => {
  let data: CovidData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    data = TestBed.inject(CovidData);
  });

  const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

  it('builds a multi-year daily timeline', () => {
    expect(data.n).toBeGreaterThan(1000);
    expect(data.confirmed.length).toBe(data.n);
    expect(data.cats.length).toBe(data.n);
  });

  it('calibrates cumulative totals to the headline KPI numbers', () => {
    expect(sum(data.confirmed)).toBeGreaterThan(4_800_000);
    expect(sum(data.confirmed)).toBeLessThan(4_950_000);
    expect(sum(data.deaths)).toBeGreaterThan(12_000);
    expect(sum(data.deaths)).toBeLessThan(14_500);
    expect(sum(data.dose1)).toBeGreaterThan(6_600_000);
    expect(sum(data.dose1)).toBeLessThan(6_850_000);
  });

  it('peaks at the Omicron wave (Jan–Feb 2022)', () => {
    let maxI = 0;
    for (let i = 1; i < data.confirmed.length; i++) {
      if (data.confirmed[i] > data.confirmed[maxI]) maxI = i;
    }
    expect(data.cats[maxI]).toMatch(/\.0[12]\.22$/);
  });

  it('keeps vaccination-status shares consistent', () => {
    for (const i of [100, 400, 800, data.n - 1]) {
      const total = data.shareUnvax[i] + data.shareExpired[i] + data.shareVax[i];
      expect(Math.abs(total - 100)).toBeLessThan(1.5);
    }
    for (let i = 1; i < data.cumVaxPct.length; i++) {
      expect(data.cumVaxPct[i]).toBeGreaterThanOrEqual(data.cumVaxPct[i - 1] - 0.001);
    }
  });

  it('formats numbers with thousands separators', () => {
    expect(data.fmt(4863945)).toContain('863');
    expect(data.fmt(1000)).toMatch(/1[,.  ]?000/);
  });
});
