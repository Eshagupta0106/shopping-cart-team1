import { Injectable } from '@angular/core';
import { CartItem } from './models/cartItem.model';
import { ProductService } from './product.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];

  constructor(private productService: ProductService) {
    this.loadCart();
  }
  public cartValue = new BehaviorSubject<number>(0);

  getCartValue(): Observable<number> {
    return this.cartValue.asObservable();
  }

  increaseCartValue(amount: number): void {
    this.cartValue.next(this.cartValue.value + amount);
  }

  decreaseCartValue(amount: number): void {
    const newValue = Math.max(0, this.cartValue.value - amount);
    this.cartValue.next(newValue);
  }

  loadCart(): void {
    const productServiceCart = this.productService.getCartItems();
    this.cart = productServiceCart;
  }

  clearCart(): void {
    this.cart = [];
    this.cartValue.next(0);
  }

  removeItem(item: CartItem): void {
    const index = this.cart.findIndex(
      (cartItem) => cartItem.product.id === item.product.id
    );
    if (index !== -1) {
      this.cart.splice(index, 1);
    }
    this.decreaseCartValue(item.quantity);
  }

  getTotal(items: Array<CartItem>): number {
    let total = 0;
    for (const item of items) {
      total += item.quantity;
    }
    return total;
  }

  changeQuantity(item: CartItem, action: string) {
    const index = this.cart.findIndex(
      (cartItem) => cartItem.product.id === item.product.id
    );
    if (index !== -1) {
      if (action === 'increase') {
        this.cart[index].quantity++;
        this.increaseCartValue(1);
      } else if (action === 'decrease') {
        if (this.cart[index].quantity > 1) {
          this.cart[index].quantity--;
          this.decreaseCartValue(1);
        }
      }
    }
  }
}
