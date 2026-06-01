import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AppState } from '../../services/app-state';

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
  readonly app = inject(AppState);

  list = viewChild<ElementRef<HTMLUListElement>>('list');
  selectedIndex = signal(0);
  private observer?: IntersectionObserver;
  private suppressScrollSpyUntil = 0;

  readonly items = computed<AnchorItem[]>(() => {
    const t = (he: string, en: string) => this.app.t(he, en);
    return [
      { id: 'section-overview',           label: t('מבט על',                    'Overview') },
      { id: 'section-main-indicators',    label: t('מדדים מרכזיים',             'Key indicators') },
      { id: 'section-children',           label: t('תחלואה ואשפוזי ילדים',      'Children morbidity & hospitalizations') },
      { id: 'section-vaccination-effect', label: t('השפעת התחסנות על התחלואה', 'Vaccination effect on morbidity') },
      { id: 'section-deceased',           label: t('נפטרים',                    'Deaths') },
      { id: 'section-tests',              label: t('בדיקות',                    'Tests') },
      { id: 'section-investigations',     label: t('תחקורים נוספים',            'Further investigations') },
      { id: 'section-recovered',          label: t('תחלואה חוזרת ומחלימים',     'Reinfections & recoveries') },
      { id: 'section-vaccination',        label: t('התחסנות האוכלוסיה',          'Population vaccination') },
    ];
  });

  get arrowStartAria() { return this.app.t('גלול ימינה', 'Scroll right'); }
  get arrowEndAria()   { return this.app.t('גלול שמאלה', 'Scroll left'); }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.attachObserver());
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  select(i: number): void {
    this.selectedIndex.set(i);
    this.suppressScrollSpyUntil = Date.now() + 800;
    const item = this.items()[i];
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
        const idx = this.items().findIndex(it => it.id === topId);
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
