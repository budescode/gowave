import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardhostComponent } from './dashboardhost.component';

describe('DashboardhostComponent', () => {
  let component: DashboardhostComponent;
  let fixture: ComponentFixture<DashboardhostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardhostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardhostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
