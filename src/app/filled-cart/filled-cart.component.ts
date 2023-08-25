import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { CartItem } from '../models/cartItem.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-filled-cart',
  templateUrl: './filled-cart.component.html',
  styleUrls: ['./filled-cart.component.css'],
})
export class FilledCartComponent implements OnInit {
  cart: CartItem[] = [];
  grand_total: number = 0;
  showNotification: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.cart = this.productService.getCartItems();
    this.calculateTotal();
  }
  goBack() {
    this.location.back();
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  removeAllItems(): void {
    this.cartService.clearCart();
  }

  removeItem(item: CartItem): void {
    this.showNotification = true;
    this.cartService.removeItem(item);
    this.hideNotificationAfterDelay(1500);
  }
  onNotificationClick() {
    this.showNotification = false;
  }
  hideNotificationAfterDelay(delay: number) {
    setTimeout(() => {
      this.showNotification = false;
    }, delay);
  }

  calculateTotal(): number {
    let total = 0;
    for (let i = 0; i < this.cart.length; i++) {
      total += this.cart[i].product.price * this.cart[i].quantity;
    }
    return total;
  }

  changeQuantity(item: CartItem, action: string) {
    this.cartService.changeQuantity(item, action);
  }
}
