import { Component, inject } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login-success-dialog',
  templateUrl: './login-success-dialog.component.html',
  styleUrl: './login-success-dialog.component.scss',
})
export class LoginSuccessDialogComponent {
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  private translateService = inject(TranslateService);

  constructor() {}

  onBrowseWebsite() {
    this.dialogRef.close('website');
  }

  onGoToTraining() {
    this.dialogRef.close('training');
  }

  onCancel() {
    this.dialogRef.close('cancel');
  }
}
