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
    verticalSlideTop: trigger('verticalSlideTop', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('250ms ease-in', style({ opacity: 1 }))
        ]),
        transition(':leave', [
            animate('250ms ease-in', style({ opacity: 0, height: '0px' }))
        ])
    ]),
    verticalSlideDown: trigger('verticalSlideDown', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('250ms ease-in', style({ opacity: 1 }))
        ]),
        transition(':leave', [
            animate('250ms ease-in', style({ opacity: 0, height: '0px' }))
        ])
    ])
};
