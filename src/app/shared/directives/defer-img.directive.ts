import { Directive, Input, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDeferImg]',
  standalone: true,
})
export class DeferImgDirective implements OnInit {
  @Input() appDeferImg: string = '';
  @Input() priority: boolean = false;
  @Input() width?: number;
  @Input() height?: number;

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const img = this.el.nativeElement;

    // Set loading attribute
    if (this.priority) {
      this.renderer.setAttribute(img, 'loading', 'eager');
      this.renderer.setAttribute(img, 'fetchpriority', 'high');
    } else {
      this.renderer.setAttribute(img, 'loading', 'lazy');
      this.renderer.setAttribute(img, 'fetchpriority', 'low');
    }

    // Set decoding attribute
    this.renderer.setAttribute(img, 'decoding', 'async');

    // Set intrinsic size if width and height are provided
    if (this.width && this.height) {
      this.renderer.setAttribute(
        img,
        'intrinsicsize',
        `${this.width}x${this.height}`
      );
    }

    // Set src if provided
    if (this.appDeferImg) {
      this.renderer.setAttribute(img, 'src', this.appDeferImg);
    }
  }
}
