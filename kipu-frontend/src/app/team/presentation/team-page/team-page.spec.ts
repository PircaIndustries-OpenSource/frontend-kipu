import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPage } from './team-page';

describe('TeamPage', () => {
  let component: TeamPage;
  let fixture: ComponentFixture<TeamPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
