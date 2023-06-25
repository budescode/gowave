import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GettokenComponent } from './gettoken.component';

describe('GettokenComponent', () => {
  let component: GettokenComponent;
  let fixture: ComponentFixture<GettokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GettokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GettokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
