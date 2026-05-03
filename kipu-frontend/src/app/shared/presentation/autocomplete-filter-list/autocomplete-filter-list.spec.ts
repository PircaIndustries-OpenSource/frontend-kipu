import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteFilterList } from './autocomplete-filter-list';

describe('AutocompleteFilterList', () => {
  let component: AutocompleteFilterList;
  let fixture: ComponentFixture<AutocompleteFilterList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteFilterList],
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteFilterList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
