import { Component, inject } from '@angular/core';
import { LangService } from './core/services/lang.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'etf-app';
  private _langService = inject(LangService);
}
