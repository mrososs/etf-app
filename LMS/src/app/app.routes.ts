import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo:'courses',
        pathMatch: 'full',
    },
  {
    path: 'courses',
    loadComponent: () =>
      import('./features/courses/courses.component').then(
        (c) => c.CoursesComponent
      ),
  },
];
