import { Injectable } from '@angular/core';
import { CartItem } from './models/cartItem.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];

  constructor(private productService: ProductService) {
    this.loadCart();
  }

  private loadCart(): void {
    const productServiceCart = this.productService.getCartItems();
    this.cart = productServiceCart;
  }

  clearCart(): void {
    this.cart = [];
  }

  removeItem(item: CartItem): void {
    const index = this.cart.findIndex(
      (cartItem) => cartItem.product.id === item.product.id
    );
    if (index !== -1) {
      this.cart.splice(index, 1);
    }
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
      } else if (action === 'decrease') {
        if (this.cart[index].quantity > 1) {
          this.cart[index].quantity--;
        }
      }
    }
  }
}
