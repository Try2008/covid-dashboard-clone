import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrls: ['./overview.scss']
  // אם אנגולר יצרה קובץ סגנון עם סיומת css, שים לב לשנות כאן ל-css
})
export class OverviewComponent {
  // נתוני דמו (Mock Data) עבור כרטיסיות המידע
  cards = [
    { title: 'מאומתים אתמול', value: '1,245', subtext: 'מחברים מתחילת המגיפה: 4.5M' },
    { title: 'חולים קשה', value: '180', subtext: 'מתוכם מונשמים: 45' },
    { title: 'נפטרים במצטבר', value: '12,500', subtext: '+3 ביממה האחרונה' },
    { title: 'אחוז בדיקות חיוביות', value: '3.2%', subtext: 'מתוך 38,000 בדיקות' },
    { title: 'מחוסנים מנה שלישית', value: '4,650,211', subtext: 'מהווים כ-50% באוכלוסייה' },
    { title: 'ציון רמזור ארצי', value: '4.8', subtext: 'מצב צהוב כללי' }
  ];
}