import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureAdd } from './signature-add';

describe('SignatureAdd', () => {
  let component: SignatureAdd;
  let fixture: ComponentFixture<SignatureAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignatureAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(SignatureAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
