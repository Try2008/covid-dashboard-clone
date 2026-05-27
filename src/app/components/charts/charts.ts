import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartComponent } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, HighchartsChartComponent],
  templateUrl: './charts.html',
  styleUrls: ['./charts.scss']
})
export class ChartsComponent {
  // שמירת הרפרנס לספרייה עצמה כדי להעביר ל-HTML
  Highcharts: typeof Highcharts = Highcharts;

  // הגדרות הגרף הראשון (Mock Data) - גרף עמודות
  chartOneOptions: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: 'מאומתים חדשים לפי יום' },
    xAxis: { categories: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'] },
    yAxis: { title: { text: 'מספר מאומתים' } },
    series: [{
      name: 'מאומתים',
      type: 'column',
      data: [450, 620, 300, 800, 520],
      color: '#1a73e8'
    }]
  };

  // כאן נוכל להוסיף בהמשך את chartTwoOptions ו-chartThreeOptions...
}