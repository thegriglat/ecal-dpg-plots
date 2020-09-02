import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotPermalinkComponent } from './plot-permalink.component';

describe('PlotPermalinkComponent', () => {
  let component: PlotPermalinkComponent;
  let fixture: ComponentFixture<PlotPermalinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotPermalinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotPermalinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
