import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeQuoteComponent } from './home-quote.component';

describe('HomeQuoteComponent', () => {
  let component: HomeQuoteComponent;
  let fixture: ComponentFixture<HomeQuoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeQuoteComponent]
    });
    fixture = TestBed.createComponent(HomeQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
