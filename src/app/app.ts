import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Navbar } from './components/navbar/navbar';
import { OverviewComponent } from './components/overview/overview';
import { ChartsComponent } from './components/charts/charts';
import { TablesComponent } from './components/tables/tables';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Navbar, OverviewComponent, ChartsComponent, TablesComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('covid-dashboard-clone');
}
