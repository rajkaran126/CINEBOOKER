import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

// Custom directive to visually highlight premium theatres with a gold border
@Directive({
    selector: '[appPremiumTheatre]',
    standalone: true
})
export class PremiumTheatreDirective implements OnInit {
    @Input() appPremiumTheatre: boolean = false;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnInit(): void {
        if (this.appPremiumTheatre) {
            this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid #f5a623');
            this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 12px rgba(245,166,35,0.4)');
        }
    }
}
