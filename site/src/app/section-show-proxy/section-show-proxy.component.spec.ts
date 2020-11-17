import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionShowProxyComponent } from './section-show-proxy.component';

describe('SectionShowProxyComponent', () => {
  let component: SectionShowProxyComponent;
  let fixture: ComponentFixture<SectionShowProxyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionShowProxyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionShowProxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
