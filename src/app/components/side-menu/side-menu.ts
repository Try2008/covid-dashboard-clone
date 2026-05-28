import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenu {
  topicItems: { label: string; active?: boolean }[] = [
    { label: 'קליטות מלחמה בבתי חולים' },
    { label: "סטאז'רים" },
    { label: 'היפגעות ילדים' },
    { label: 'בחינות סיעוד' },
    { label: 'שירותים רפואיים בישראל' },
    { label: 'מבוטחי קופות חולים' },
    { label: 'חופים' },
    { label: 'הנקה' },
    { label: 'הערכת התפתחות הילד' },
    { label: 'מדדי גדילה בפעוטות' },
    { label: 'מדדי גדילה בילדים' },
    { label: 'איכות במערכת הבריאות' },
    { label: 'נציבות הקבילות' },
    { label: 'סקר חווית המטופל' },
    { label: 'קורונה', active: true },
  ];

  footerItems = ['אודות', 'הצהרת נגישות', 'תנאי שימוש'];
}
