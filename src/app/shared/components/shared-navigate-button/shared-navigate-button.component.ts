import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-navigate-button',
  templateUrl: './shared-navigate-button.component.html',
  styleUrl: './shared-navigate-button.component.scss',
})
export class SharedNavigateButtonComponent {
  @Input() isActive: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  handleClick() {
    this.clicked.emit();
  }
}
