import { TestBed } from '@angular/core/testing';

import { KpiCardComponent } from './overview';

describe('KpiCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiCardComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(KpiCardComponent);
    fixture.componentRef.setInput('title', 'מאומתים אתמול');
    expect(fixture.componentInstance).toBeTruthy();
  });
});
