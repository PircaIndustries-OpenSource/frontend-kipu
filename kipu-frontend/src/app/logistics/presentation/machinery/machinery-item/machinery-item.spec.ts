import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineryItem } from './machinery-item';

describe('MachineryItem', () => {
  let component: MachineryItem;
  let fixture: ComponentFixture<MachineryItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineryItem],
    }).compileComponents();

    fixture = TestBed.createComponent(MachineryItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
