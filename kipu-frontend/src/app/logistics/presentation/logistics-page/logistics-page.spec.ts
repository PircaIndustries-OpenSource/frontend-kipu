import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticsPage } from './logistics-page';

describe('LogisticsPage', () => {
  let component: LogisticsPage;
  let fixture: ComponentFixture<LogisticsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogisticsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LogisticsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
