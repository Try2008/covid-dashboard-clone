import { Injectable, inject } from '@angular/core';
import { AppState } from './app-state';

/**
 * CovidData — deterministic, realistic static snapshot of Israel's COVID-19
 * pandemic, reconstructed to mirror the Ministry of Health "עולם הדאטה" dashboard.
 *
 * All series share one daily timeline (2020-03-01 → 2023-05-31) and are generated
 * from a calibrated sum-of-Gaussians wave model so the charts show the real
 * epidemic shape (the Jan-2022 Omicron spike dominates), not flat noise.
 *
 * Invariants:
 *  - Every array has length `n` and is CHRONOLOGICAL (oldest → newest), so the
 *    chart date-range filter (which keeps the tail via .slice(-n)) shows the
 *    most-recent window.
 *  - Cumulative totals are calibrated to the headline KPI numbers so the cards
 *    and the cumulative charts agree.
 */

const DAY = 86_400_000;

@Injectable({ providedIn: 'root' })
export class CovidData {
  private readonly app = inject(AppState);

  // ── Canonical daily timeline ─────────────────────────────────────────────
  private readonly startMs = Date.UTC(2020, 2, 1); // 2020-03-01
  private readonly endMs = Date.UTC(2023, 4, 31); // 2023-05-31
  readonly n = Math.round((this.endMs - this.startMs) / DAY) + 1;

  /** Category labels in DD.MM.YY (year keeps the multi-year axis unambiguous). */
  readonly cats: string[];

  // ── Daily series (length n) ──────────────────────────────────────────────
  readonly confirmed: number[];
  readonly deaths: number[];
  readonly recoveries: number[];
  readonly testsPCR: number[];
  readonly testsAntigen: number[];
  readonly testsTotal: number[];
  readonly posPCR: number[];
  readonly posAntigen: number[];

  readonly children: { a04: number[]; a511: number[]; a1215: number[]; a1619: number[] };

  readonly vaxEffUnvax: number[];
  readonly vaxEffExpired: number[];
  readonly vaxEffVax: number[];

  readonly deathVaxUnvax: number[];
  readonly deathVaxExpired: number[];
  readonly deathVaxVax: number[];

  readonly reinfUnvax: number[];
  readonly reinfVax: number[];

  readonly dose1: number[];
  readonly dose2: number[];
  readonly dose3: number[];
  readonly dose4: number[];

  readonly shareUnvax: number[];
  readonly shareExpired: number[];
  readonly shareVax: number[];
  readonly cumVaxPct: number[];

  /** Last-three-weeks average of daily confirmed (the 3-bar summary chart). */
  readonly weeklyAvgCats: string[];
  readonly weeklyAvgVals: number[];

  constructor() {
    const n = this.n;
    this.cats = Array.from({ length: n }, (_, i) => this.label(i));

    // Daily new confirmed: calibrated waves + decaying baseline + weekend dip.
    this.confirmed = this.calibrate(
      Array.from({ length: n }, (_, i) => {
        const baseline = 3 + 60 * this.logistic(-(i - this.idx('2022-09-15')) / 55);
        let v = baseline + this.waves(i, [
          ['2020-04-12', 22, 650],
          ['2020-09-24', 26, 4200],
          ['2021-01-18', 26, 10000],
          ['2021-09-07', 34, 11000],
          ['2022-01-25', 19, 85000],
          ['2022-07-12', 28, 12500],
          ['2022-10-25', 45, 3000],
        ]);
        return v * this.weekend(i) * this.jitter(101, i);
      }),
      4_863_945,
    );
    const maxC = Math.max(...this.confirmed);

    // Daily deaths: lagged, lower lethality after vaccines, calibrated to total.
    this.deaths = this.calibrate(
      Array.from({ length: n }, (_, i) => {
        const baseline = 0.2 + 2 * this.logistic(-(i - this.idx('2022-10-01')) / 55);
        const v = baseline + this.waves(i, [
          ['2020-04-22', 24, 7],
          ['2020-10-06', 26, 32],
          ['2021-01-30', 26, 65],
          ['2021-09-22', 34, 32],
          ['2022-02-06', 22, 62],
          ['2022-08-02', 30, 20],
          ['2022-11-10', 45, 7],
        ]);
        return v * this.jitter(202, i);
      }),
      13_174,
    );

    // Tests derived from positivity; positivity saturates with case load.
    this.posPCR = [];
    this.posAntigen = [];
    this.testsPCR = [];
    this.testsAntigen = [];
    this.testsTotal = [];
    for (let i = 0; i < n; i++) {
      const c = this.confirmed[i];
      const p = 0.015 + c / (c + 200_000); // ~1.5% baseline → ~24% at Omicron
      const total = Math.max(3000, Math.round(c / p));
      const af = this.clamp((i - this.idx('2021-12-01')) / 120, 0, 0.5); // antigen share grows
      const pcr = Math.round(total * (1 - af));
      this.testsTotal.push(total);
      this.testsPCR.push(pcr);
      this.testsAntigen.push(total - pcr);
      this.posPCR.push(+(p * 100 * 0.9).toFixed(2));
      this.posAntigen.push(+(p * 100 * 1.25).toFixed(2));
    }

    // Recoveries ≈ confirmed lagged ~14 days.
    this.recoveries = Array.from({ length: n }, (_, i) => this.confirmed[Math.max(0, i - 14)]);

    // Children confirmed by age band (7-day moving average of band counts).
    this.children = {
      a04: this.movingAvg(this.confirmed.map((c, i) => c * 0.018 * this.jitter(11, i))),
      a511: this.movingAvg(this.confirmed.map((c, i) => c * 0.06 * this.jitter(12, i))),
      a1215: this.movingAvg(this.confirmed.map((c, i) => c * 0.03 * this.jitter(13, i))),
      a1619: this.movingAvg(this.confirmed.map((c, i) => c * 0.035 * this.jitter(14, i))),
    };

    // Cases / deaths per 100k by vaccination status (age 60+), shaped by the waves.
    const cn = (i: number) => this.confirmed[i] / maxC;
    const maxD = Math.max(...this.deaths);
    const dn = (i: number) => this.deaths[i] / maxD;
    this.vaxEffUnvax = Array.from({ length: n }, (_, i) => +(cn(i) * 620 * this.jitter(21, i)).toFixed(1));
    this.vaxEffExpired = Array.from({ length: n }, (_, i) => +(cn(i) * 360 * this.jitter(22, i)).toFixed(1));
    this.vaxEffVax = Array.from({ length: n }, (_, i) => +(cn(i) * 150 * this.jitter(23, i)).toFixed(1));
    this.deathVaxUnvax = Array.from({ length: n }, (_, i) => +(dn(i) * 0.95 * this.jitter(24, i)).toFixed(2));
    this.deathVaxExpired = Array.from({ length: n }, (_, i) => +(dn(i) * 0.45 * this.jitter(25, i)).toFixed(2));
    this.deathVaxVax = Array.from({ length: n }, (_, i) => +(dn(i) * 0.13 * this.jitter(26, i)).toFixed(2));

    // Reinfections (mostly from the Omicron era onward), split unvax/vax.
    this.reinfUnvax = [];
    this.reinfVax = [];
    for (let i = 0; i < n; i++) {
      const frac = 0.09 * this.logistic((i - this.idx('2022-01-01')) / 40);
      const reinf = this.confirmed[i] * frac;
      this.reinfVax.push(Math.round(reinf * 0.62 * this.jitter(31, i)));
      this.reinfUnvax.push(Math.round(reinf * 0.38 * this.jitter(32, i)));
    }

    // Daily vaccinations per dose, each calibrated to its cumulative KPI total.
    this.dose1 = this.calibrate(this.bump('2021-01-08', 34), 6_722_627);
    this.dose2 = this.calibrate(this.bump('2021-02-02', 34), 6_006_974);
    this.dose3 = this.calibrate(this.bump('2021-09-05', 30), 3_854_872);
    this.dose4 = this.calibrate(this.bump('2022-01-22', 24), 474_534);

    // Vaccination-status share (%) over time; the three bands sum to ~100.
    this.shareUnvax = [];
    this.shareExpired = [];
    this.shareVax = [];
    this.cumVaxPct = [];
    for (let i = 0; i < n; i++) {
      const vaccinated = 78 * this.logistic((i - this.idx('2021-02-01')) / 26);
      const expiredFrac = 0.36 * this.logistic((i - this.idx('2021-10-15')) / 70);
      const expired = vaccinated * expiredFrac;
      this.shareVax.push(+(vaccinated - expired).toFixed(1));
      this.shareExpired.push(+expired.toFixed(1));
      this.shareUnvax.push(+(100 - vaccinated).toFixed(1));
      this.cumVaxPct.push(+vaccinated.toFixed(1));
    }

    // Last 3 weekly averages of daily confirmed (the small 3-bar summary).
    const vals: number[] = [];
    const labels: string[] = [];
    for (let w = 2; w >= 0; w--) {
      const end = n - w * 7;
      const start = end - 7;
      const slice = this.confirmed.slice(Math.max(0, start), end);
      vals.push(Math.round(slice.reduce((a, b) => a + b, 0) / slice.length));
      labels.push(`${this.short(start)}-${this.short(end - 1)}`);
    }
    this.weeklyAvgCats = labels;
    this.weeklyAvgVals = vals;
  }

  // ── Public helpers ────────────────────────────────────────────────────────

  /** Locale-aware thousands formatting (he-IL / en-US). */
  fmt(value: number): string {
    const locale = this.app.lang() === 'en' ? 'en-US' : 'he-IL';
    return new Intl.NumberFormat(locale).format(Math.round(value));
  }

  /** 7-day (default) trailing moving average, same length as the input. */
  movingAvg(arr: number[], window = 7): number[] {
    const out: number[] = [];
    const q: number[] = [];
    let sum = 0;
    for (const value of arr) {
      q.push(value);
      sum += value;
      if (q.length > window) sum -= q.shift()!;
      out.push(+(sum / q.length).toFixed(2));
    }
    return out;
  }

  get lastUpdatedLabel(): string {
    const d = new Date(this.endMs);
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = d.getUTCFullYear();
    return this.app.t(`עדכון אחרון: ${dd}.${mm}.${yyyy}`, `Last updated: ${dd}/${mm}/${yyyy}`);
  }

  // ── Internal generation helpers ────────────────────────────────────────────

  private dayMs(i: number): number {
    return this.startMs + i * DAY;
  }

  private idx(iso: string): number {
    const [y, m, d] = iso.split('-').map(Number);
    return Math.round((Date.UTC(y, m - 1, d) - this.startMs) / DAY);
  }

  private label(i: number): string {
    const d = new Date(this.dayMs(i));
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const yy = String(d.getUTCFullYear()).slice(2);
    return `${dd}.${mm}.${yy}`;
  }

  private short(i: number): string {
    const d = new Date(this.dayMs(Math.max(0, Math.min(this.n - 1, i))));
    return `${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  }

  /** Sum of Gaussian bumps: [isoCenter, widthDays, peakAmplitude][]. */
  private waves(i: number, peaks: [string, number, number][]): number {
    let v = 0;
    for (const [iso, w, a] of peaks) {
      const d = i - this.idx(iso);
      v += a * Math.exp(-(d * d) / (2 * w * w));
    }
    return v;
  }

  /** A single calibrated campaign bump (used for vaccination doses). */
  private bump(isoCenter: string, width: number): number[] {
    return Array.from({ length: this.n }, (_, i) => {
      const d = i - this.idx(isoCenter);
      return Math.max(0, Math.exp(-(d * d) / (2 * width * width)) * this.jitter(77, i));
    });
  }

  private weekend(i: number): number {
    const dow = new Date(this.dayMs(i)).getUTCDay(); // 5 = Fri, 6 = Sat (Israeli weekend)
    return dow === 5 || dow === 6 ? 0.78 : 1.04;
  }

  /** Deterministic per-day multiplier in roughly [0.85, 1.15]. */
  private jitter(seed: number, i: number): number {
    let s = (seed * 9301 + i * 49297 + 233) % 233280;
    if (s < 0) s += 233280;
    return 0.85 + (s / 233280) * 0.3;
  }

  private logistic(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  private clamp(x: number, lo: number, hi: number): number {
    return Math.max(lo, Math.min(hi, x));
  }

  /** Scale a raw series so its sum equals `target`, then round to integers. */
  private calibrate(raw: number[], target: number): number[] {
    const sum = raw.reduce((a, b) => a + Math.max(0, b), 0) || 1;
    const k = target / sum;
    return raw.map((v) => Math.max(0, Math.round(v * k)));
  }
}
