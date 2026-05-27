import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  align?: 'right' | 'left' | 'center';
  format?: 'number' | 'percent' | 'text';
}

@Component({
  selector: 'app-table-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tables.html',
  styleUrls: ['./tables.scss'],
})
export class TableCardComponent {
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input({ required: true }) columns: TableColumn[] = [];
  @Input({ required: true }) rows: Record<string, string | number>[] = [];

  sortKey = '';
  sortAsc = true;

  sortBy(key: string): void {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
    const dir = this.sortAsc ? 1 : -1;
    this.rows = [...this.rows].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av === bv) return 0;
      return av > bv ? dir : -dir;
    });
  }
}
