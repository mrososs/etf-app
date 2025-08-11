import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [NavbarComponent, FooterComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    DialogModule,
    ButtonModule,
    ToastrModule,
  ],
  exports: [NavbarComponent, FooterComponent, DialogModule, ButtonModule],
})
export class LayoutModule {}
