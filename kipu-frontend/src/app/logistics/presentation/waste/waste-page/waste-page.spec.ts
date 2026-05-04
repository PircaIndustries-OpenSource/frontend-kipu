import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WastePage } from './waste-page';

describe('WastePage', () => {
  let component: WastePage;
  let fixture: ComponentFixture<WastePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WastePage],
    }).compileComponents();

    fixture = TestBed.createComponent(WastePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
