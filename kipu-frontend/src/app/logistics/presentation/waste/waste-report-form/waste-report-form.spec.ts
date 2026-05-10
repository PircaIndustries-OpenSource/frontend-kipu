import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WasteReportForm } from './waste-report-form';

describe('WasteReportForm', () => {
  let component: WasteReportForm;
  let fixture: ComponentFixture<WasteReportForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WasteReportForm],
    }).compileComponents();

    fixture = TestBed.createComponent(WasteReportForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
