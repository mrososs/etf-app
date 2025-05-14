import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedNavigateButtonComponent } from './components/shared-navigate-button/shared-navigate-button.component';

@NgModule({
  declarations: [SharedNavigateButtonComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedNavigateButtonComponent,
  ],
})
export class SharedModule {}
