import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkersAddWorker } from './workers-add-worker';

describe('WorkersAddWorker', () => {
  let component: WorkersAddWorker;
  let fixture: ComponentFixture<WorkersAddWorker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkersAddWorker],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkersAddWorker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
