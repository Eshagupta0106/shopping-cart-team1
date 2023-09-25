import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { CartItem } from '../models/cartItem.model';
import { Location } from '@angular/common';
import { LocalstorageService } from '../service/localstorage.service';
@Component({
  selector: 'app-filled-cart',
  templateUrl: './filled-cart.component.html',
  styleUrls: ['./filled-cart.component.css'],
})
export class FilledCartComponent implements OnInit {
  cart: CartItem[] = [];
  showNotification: boolean = false;
  constructor(private cartService: CartService, private location: Location, private localStorageService: LocalstorageService) { }

  async ngOnInit() {
    const cartItems = this.localStorageService.getLocalStorageItem('cart');
    if (cartItems) {
      this.cart = JSON.parse(cartItems as string);
    }
    else {
      this.cart = [];
    }
    this.calculateTotal();
  }

  goBack() {
    this.location.back();
  }

  async removeItem(item: CartItem) {
    this.showNotification = true;
    const cartItemIndex = this.cart.findIndex((cartItem: CartItem) => cartItem.product.id == item.product.id);
    if (cartItemIndex !== -1) {
      this.cart.splice(cartItemIndex, 1);
      this.localStorageService.setLocalStorageItem('cart', JSON.stringify(this.cart));
    }
    await this.cartService.removeItem(item.product.id);
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

  async changeQuantity(item: CartItem, action: string) {
    const cartItemIndex = this.cart.findIndex((cartItem: CartItem) => cartItem.product.id == item.product.id);
    if (cartItemIndex !== -1) {
      if (action == 'increase') {
        this.cart[cartItemIndex].quantity += 1; 
      }
      else {
        this.cart[cartItemIndex].quantity -= 1;  
      }
      this.localStorageService.setLocalStorageItem('cart', JSON.stringify(this.cart));
    }
    await this.cartService.changeQuantity(item.product.id, action);
  }
}
