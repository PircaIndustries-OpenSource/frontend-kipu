import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSuccessDialog } from './request-success-dialog';

describe('RequestSuccessDialog', () => {
  let component: RequestSuccessDialog;
  let fixture: ComponentFixture<RequestSuccessDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestSuccessDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestSuccessDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
