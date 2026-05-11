import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDetailDialog } from './request-detail-dialog';

describe('RequestDetailDialog', () => {
  let component: RequestDetailDialog;
  let fixture: ComponentFixture<RequestDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestDetailDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestDetailDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
