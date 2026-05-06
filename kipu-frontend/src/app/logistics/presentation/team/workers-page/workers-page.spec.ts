import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkersPage } from './workers-page';

describe('WorkersPage', () => {
  let component: WorkersPage;
  let fixture: ComponentFixture<WorkersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkersPage],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkersPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
