import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestModifyDialog } from './request-modify-dialog';

describe('RequestModifyDialog', () => {
  let component: RequestModifyDialog;
  let fixture: ComponentFixture<RequestModifyDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestModifyDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestModifyDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
