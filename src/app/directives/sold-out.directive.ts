import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

// Custom directive to visually highlight sold-out showtimes
@Directive({
    selector: '[appSoldOut]',
    standalone: true
})
export class SoldOutDirective implements OnInit {
    @Input() appSoldOut: boolean = false;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnInit(): void {
        if (this.appSoldOut) {
            this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
            this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed');
            this.renderer.setStyle(this.el.nativeElement, 'filter', 'grayscale(80%)');
        }
    }
}
