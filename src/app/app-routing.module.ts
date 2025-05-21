import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },

  {
    path: 'landing-page',
    loadChildren: () =>
      import('./features/landing-page/landing-page.module').then(
        (m) => m.LandingPageModule
      ),
  },
];
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled', // ⬅️ دي المهمة
  anchorScrolling: 'enabled',
  scrollOffset: [0, 0],
};
@NgModule({
  imports: [RouterModule.forRoot(routes,routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
