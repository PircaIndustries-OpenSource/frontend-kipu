import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSendInvitation } from './users-send-invitation';

describe('UsersSendInvitation', () => {
  let component: UsersSendInvitation;
  let fixture: ComponentFixture<UsersSendInvitation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersSendInvitation],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersSendInvitation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
