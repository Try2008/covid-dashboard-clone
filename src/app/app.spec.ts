import { TestBed } from '@angular/core/testing';
import { provideHighcharts } from 'highcharts-angular';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHighcharts({ instance: () => import('highcharts') })],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('exposes the Hebrew coronavirus page title', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance.pageTitle).toBe('קורונה');
  });
});
