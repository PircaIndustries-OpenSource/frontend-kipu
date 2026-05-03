import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialItem } from './material-item';

describe('MaterialItem', () => {
  let component: MaterialItem;
  let fixture: ComponentFixture<MaterialItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialItem],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
