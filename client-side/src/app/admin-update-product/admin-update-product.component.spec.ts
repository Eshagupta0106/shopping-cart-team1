import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateProductComponent } from './admin-update-product.component';

describe('AdminUpdateProductComponent', () => {
  let component: AdminUpdateProductComponent;
  let fixture: ComponentFixture<AdminUpdateProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUpdateProductComponent]
    });
    fixture = TestBed.createComponent(AdminUpdateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
