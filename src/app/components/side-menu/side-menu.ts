import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppState } from '../../services/app-state';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenu {
  readonly app = inject(AppState);

  get sideMenuAria() { return this.app.t('תפריט צד', 'Side menu'); }
  get dataWorldTitle() { return this.app.t('עולם הדאטה', 'Data World'); }

  readonly topicItems = computed<{ label: string; iconKey: string; active?: boolean }[]>(() => {
    const t = (he: string, en: string) => this.app.t(he, en);
    return [
      { label: t('קליטות מלחמה בבתי חולים', 'Wartime hospital admissions'), iconKey: 'hospital' },
      { label: t("סטאז'רים",                'Interns'),                      iconKey: 'graduation' },
      { label: t('היפגעות ילדים',           'Child injuries'),               iconKey: 'child-warning' },
      { label: t('בחינות סיעוד',            'Nursing exams'),                iconKey: 'exam' },
      { label: t('שירותים רפואיים בישראל',  'Medical services in Israel'),   iconKey: 'medical-services' },
      { label: t('מבוטחי קופות חולים',      'Health fund insureds'),         iconKey: 'users-shield' },
      { label: t('חופים',                   'Beaches'),                      iconKey: 'beaches' },
      { label: t('הנקה',                    'Breastfeeding'),                iconKey: 'breastfeeding' },
      { label: t('הערכת התפתחות הילד',      'Child development assessment'), iconKey: 'child-dev' },
      { label: t('מדדי גדילה בפעוטות',      'Toddler growth metrics'),       iconKey: 'toddler-growth' },
      { label: t('מדדי גדילה בילדים',       'Child growth metrics'),         iconKey: 'child-growth' },
      { label: t('איכות במערכת הבריאות',    'Healthcare quality'),           iconKey: 'quality' },
      { label: t('נציבות הקבילות',          'Complaints ombudsman'),         iconKey: 'complaints' },
      { label: t('סקר חווית המטופל',        'Patient experience survey'),    iconKey: 'survey' },
      { label: t('קורונה',                  'Coronavirus'),                  iconKey: 'corona', active: true },
    ];
  });

  readonly footerItems = computed<{ key: string; label: string }[]>(() => {
    const t = (he: string, en: string) => this.app.t(he, en);
    return [
      { key: 'about',         label: t('אודות',           'About') },
      { key: 'accessibility', label: t('הצהרת נגישות',    'Accessibility statement') },
      { key: 'terms',         label: t('תנאי שימוש',      'Terms of use') },
    ];
  });
}
