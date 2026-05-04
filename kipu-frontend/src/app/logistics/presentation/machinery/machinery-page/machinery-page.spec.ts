import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineryPage } from './machinery-page';

describe('MachineryPage', () => {
  let component: MachineryPage;
  let fixture: ComponentFixture<MachineryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineryPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MachineryPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
