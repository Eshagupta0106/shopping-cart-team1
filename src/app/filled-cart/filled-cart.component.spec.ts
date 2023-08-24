import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilledCartComponent } from './filled-cart.component';

describe('FilledCartComponent', () => {
  let component: FilledCartComponent;
  let fixture: ComponentFixture<FilledCartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilledCartComponent],
    });
    fixture = TestBed.createComponent(FilledCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
