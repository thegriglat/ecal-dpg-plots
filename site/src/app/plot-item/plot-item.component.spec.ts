import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotItemComponent } from './plot-item.component';

describe('PlotItemComponent', () => {
  let component: PlotItemComponent;
  let fixture: ComponentFixture<PlotItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
