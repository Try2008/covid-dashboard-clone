import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tables.html',
  styleUrls: ['./tables.scss']
})
export class TablesComponent {
  // נתוני הדגמה לטבלת חיסונים
  vaccineData = [
    { city: 'ירושלים', firstDose: 70, secondDose: 65, thirdDose: 40 },
    { city: 'תל אביב-יפו', firstDose: 85, secondDose: 82, thirdDose: 60 },
    { city: 'חיפה', firstDose: 80, secondDose: 78, thirdDose: 55 }
  ];

  // נתוני הדגמה לטבלת רמזור
  trafficLightData = [
    { city: 'אילת', score: 4.2, color: 'צהוב' },
    { city: 'בני ברק', score: 6.8, color: 'כתום' },
    { city: 'הרצליה', score: 3.1, color: 'ירוק' }
  ];

  sortColumn = '';
  sortAscending = true;

  // פונקציית מיון גנרית
  sortTable(dataArray: any[], column: string) {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }

    dataArray.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });
  }
}