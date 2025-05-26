import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-training-course',
  standalone: true,
  imports: [CommonModule, CardModule,ButtonModule],
  templateUrl: './Training-course.component.html',
  styleUrl: './Training-course.component.scss',
})
export class TrainingCourseComponent {}
