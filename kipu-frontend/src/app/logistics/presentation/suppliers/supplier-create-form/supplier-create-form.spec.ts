import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierCreateForm } from './supplier-create-form';

describe('SupplierCreateForm', () => {
  let component: SupplierCreateForm;
  let fixture: ComponentFixture<SupplierCreateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierCreateForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierCreateForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
