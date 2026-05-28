import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';

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
export class Navbar implements AfterViewInit, OnDestroy {
  list = viewChild<ElementRef<HTMLUListElement>>('list');
  selectedIndex = signal(0);
  private observer?: IntersectionObserver;
  private suppressScrollSpyUntil = 0;

  items: AnchorItem[] = [
    { id: 'section-overview',            label: 'מבט על' },
    { id: 'section-main-indicators',     label: 'מדדים מרכזיים' },
    { id: 'section-children',            label: 'תחלואה ואשפוזי ילדים' },
    { id: 'section-vaccination-effect',  label: 'השפעת התחסנות על התחלואה' },
    { id: 'section-deceased',            label: 'נפטרים' },
    { id: 'section-tests',               label: 'בדיקות' },
    { id: 'section-investigations',      label: 'תחקורים נוספים' },
    { id: 'section-recovered',           label: 'תחלואה חוזרת ומחלימים' },
    { id: 'section-vaccination',         label: 'התחסנות האוכלוסיה' },
  ];

  ngAfterViewInit(): void {
    queueMicrotask(() => this.attachObserver());
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  select(i: number): void {
    this.selectedIndex.set(i);
    // Ignore the observer for a short window while smooth-scroll happens
    this.suppressScrollSpyUntil = Date.now() + 800;
    const item = this.items[i];
    const target = document.getElementById(item.id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.ensureItemVisible(i);
  }

  scroll(direction: 1 | -1): void {
    const el = this.list()?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: direction * 200, behavior: 'smooth' });
  }

  private attachObserver(): void {
    const sections = document.querySelectorAll<HTMLElement>('.section');
    if (sections.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < this.suppressScrollSpyUntil) return;

        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;

        const topId = visible[0].target.id;
        const idx = this.items.findIndex(it => it.id === topId);
        if (idx >= 0 && idx !== this.selectedIndex()) {
          this.selectedIndex.set(idx);
          this.ensureItemVisible(idx);
        }
      },
      { rootMargin: '-127px 0px -55% 0px', threshold: 0 },
    );

    sections.forEach(s => this.observer!.observe(s));
  }

  private ensureItemVisible(i: number): void {
    const listEl = this.list()?.nativeElement;
    if (!listEl) return;
    const item = listEl.children.item(i) as HTMLElement | null;
    item?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }
}
