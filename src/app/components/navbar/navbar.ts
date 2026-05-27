import { Component, ElementRef, signal, viewChild } from '@angular/core';

export interface AnchorItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-alternative-anchor-bar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  list = viewChild<ElementRef<HTMLUListElement>>('list');
  selectedIndex = signal(0);

  items: AnchorItem[] = [
    { id: 'section-overview',        label: 'תמונת מצב' },
    { id: 'section-cases',           label: 'תחלואה' },
    { id: 'section-tests',           label: 'בדיקות' },
    { id: 'section-hospitalization', label: 'אשפוז' },
    { id: 'section-mortality',       label: 'תמותה' },
    { id: 'section-vaccinations',    label: 'חיסונים' },
    { id: 'section-traffic-light',   label: 'רמזור יישובי' },
    { id: 'section-variants',        label: 'וריאנטים' },
    { id: 'section-isolation',       label: 'בידוד' },
  ];

  select(i: number): void {
    this.selectedIndex.set(i);
  }

  scroll(direction: 1 | -1): void {
    const el = this.list()?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: direction * 200, behavior: 'smooth' });
  }
}
