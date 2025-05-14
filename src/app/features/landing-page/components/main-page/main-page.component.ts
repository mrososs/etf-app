import { Component } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  selected: string = 'أخبار عن الإتحاد'; // ✅ لازم تتعرف هنا
  isExpanded = false;

  toggleText() {
    this.isExpanded = !this.isExpanded;
  }
}
