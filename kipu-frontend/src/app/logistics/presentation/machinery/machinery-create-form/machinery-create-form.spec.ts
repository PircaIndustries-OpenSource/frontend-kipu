import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MachineryCreateForm } from './machinery-create-form';

describe('MachineryCreateForm', () => {
  let component: MachineryCreateForm;
  let fixture: ComponentFixture<MachineryCreateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineryCreateForm],
    }).compileComponents();

    fixture = TestBed.createComponent(MachineryCreateForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
