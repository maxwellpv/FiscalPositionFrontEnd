import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualRecordsViewComponent } from './annual-records-view.component';

describe('AnnualRecordsViewComponent', () => {
  let component: AnnualRecordsViewComponent;
  let fixture: ComponentFixture<AnnualRecordsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualRecordsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualRecordsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
