import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamedetailsComponent } from './namedetails.component';

describe('NamedetailsComponent', () => {
  let component: NamedetailsComponent;
  let fixture: ComponentFixture<NamedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NamedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NamedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
