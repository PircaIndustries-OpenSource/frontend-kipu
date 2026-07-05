import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RncCreatePage } from './rnc-create-page';

describe('RncCreatePage', () => {
  let component: RncCreatePage;
  let fixture: ComponentFixture<RncCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RncCreatePage],
    }).compileComponents();

    fixture = TestBed.createComponent(RncCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
