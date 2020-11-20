import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePaginatorComponent } from './image-paginator.component';

describe('ImagePaginatorComponent', () => {
  let component: ImagePaginatorComponent;
  let fixture: ComponentFixture<ImagePaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagePaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagePaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
