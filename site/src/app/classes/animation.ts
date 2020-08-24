import { trigger, transition, style, animate, state } from '@angular/animations';


export const Animations = {
    fadeAnimation: trigger('fadeAnimation', [
        // https://www.kdechant.com/blog/angular-animations-fade-in-and-fade-out
        state('in', style({ opacity: 1 })),
        transition(':enter', [
            style({ opacity: 0 }),
            animate(250)
        ]),
        transition(':leave',
            animate(250, style({ opacity: 0 })))
    ]),
    verticalSlide: trigger('verticalSlide', [
        transition(':enter', [
            style({ transform: 'translateY(-100%)', opacity: 0 }),
            animate('400ms ease-in', style({ transform: 'translateY(0%)', opacity: 1 }))
        ]),
        transition(':leave', [
            animate('400ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
        ])
    ])
}