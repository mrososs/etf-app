import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { types } from '../model/types.model';
import { HomePageService } from '../services/home-page.service';

@Component({
  selector: 'app-types',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [HomePageService],
  templateUrl: './types.component.html',
  styleUrl: './types.component.scss',
})
export class TypesComponent implements OnInit {
  types = signal<types[]>([]);
  private _homePageService = inject(HomePageService);
  ngOnInit(): void {
    this._homePageService.getTypes().subscribe((data: types[]) => {
      this.types.set(data);
    });
  }
}
