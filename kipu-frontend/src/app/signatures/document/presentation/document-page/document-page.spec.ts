import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPage } from './document-page';

describe('DocumentPage', () => {
  let component: DocumentPage;
  let fixture: ComponentFixture<DocumentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
