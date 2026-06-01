import { TestBed } from '@angular/core/testing';

import { TableCardComponent } from './tables';

describe('TableCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCardComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TableCardComponent);
    fixture.componentRef.setInput('title', 'טבלה');
    fixture.componentRef.setInput('columns', []);
    fixture.componentRef.setInput('rows', []);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
