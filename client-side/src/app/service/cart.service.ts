import { Injectable } from '@angular/core';
import { CartItem } from '../models/cartItem.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: CartItem[] = [];
  public cartValue = new BehaviorSubject<number>(this.getCartValue());

  constructor(private route: Router) {
    this.loadCart();
  }

  getCartValue(): number {
    return JSON.parse(localStorage.getItem('cartValue') as string) || 0;
  }

  increaseCartValue(amount: number): void {
    const cartNumber = this.getCartValue() + amount;
    localStorage.setItem('cartValue', JSON.stringify(cartNumber));
    this.cartValue.next(cartNumber);
  }

  decreaseCartValue(amount: number): void {
    const newValue = Math.max(0, this.getCartValue() - amount);
    localStorage.setItem('cartValue', JSON.stringify(newValue));
    this.cartValue.next(newValue);
  }

  addToCart(product: any, quantity: number): void {
    const existingCartItem = this.cart.find(
      (item) => item.product.id === product.id
    );
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      this.cart.push({ product, quantity });
    }
    const newCartValue = this.calculateCartValue();
    this.updateCartValue(newCartValue);
    this.updateCartInLocalStorage();
  }

  buyNow(product: any, quantity: number) {
    if (!this.itemInCart(product)) {
      this.cart.push({ product, quantity });
      this.updateCartInLocalStorage();
    }
    this.route.navigate(['/cart']);
  }

  itemInCart(product: any): boolean {
    return this.cart.some((item) => item.product.id === product.id);
  }

  getCartItems(): CartItem[] {
    return this.cart;
  }

  loadCart(): void {
    const storedCart = JSON.parse(localStorage.getItem('cartItem') as string);
    if (storedCart) {
      this.cart = storedCart;
    }
  }

  clearCart(): void {
    localStorage.removeItem('cartItem');
    this.cart = [];
    localStorage.removeItem('cartValue');
    this.cartValue.next(0);
  }

  removeItem(item: CartItem): void {
    const index = this.cart.findIndex(
      (cartItem) => cartItem.product.id === item.product.id
    );
    if (index !== -1) {
      const removedItem = this.cart.splice(index, 1)[0];
      this.decreaseCartValue(removedItem.quantity);
      this.updateCartInLocalStorage();
    }
  }

  getTotal(): number {
    let total = 0;
    for (const item of this.cart) {
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
      this.updateCartInLocalStorage();
    }
  }

  updateCartValue(newValue: number): void {
    this.cartValue.next(newValue);
  }

  private calculateCartValue(): number {
    let totalValue = 0;
    for (const item of this.cart) {
      totalValue += item.product.price * item.quantity;
    }
    return totalValue;
  }

  private updateCartInLocalStorage(): void {
    localStorage.setItem('cartItem', JSON.stringify(this.cart));
  }
}
