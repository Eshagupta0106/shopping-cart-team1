import { Injectable } from '@angular/core';
import { CartItem } from '../models/cartItem.model';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieInteractionService } from './cookieinteraction.service';
import { map } from 'rxjs';
import { Product } from '../models/product.model';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: CartItem[] = [];

  constructor(private route: Router, private http: HttpClient, private cookieInteractionService: CookieInteractionService, private localStorageService: LocalstorageService) {
  }
  ngOnInit() {
    this.loadCart();
  }
  async addToCart(item: Product, quantity: number): Promise<void> {
    const cartItems = this.localStorageService.getLocalStorageItem('cart');
    if (cartItems) {
      const cart = JSON.parse(cartItems as string);
      const ind = cart.findIndex((cartItem: CartItem) => cartItem.product.id == item.id);
      if (ind !== -1) {
        cart[ind].quantity += quantity;
      } else {
        const cartItem = {
          product: item,
          quantity: quantity
        };
        cart.push(cartItem);
      }
      this.localStorageService.setLocalStorageItem('cart', JSON.stringify(cart));
    }
    await this.addToMongodbCart(item, quantity);
  }

  async buyNow(product: any, quantity: number) {
    if (!this.itemInCart(product)) {
      this.cart.push({ product, quantity });
      this.localStorageService.setLocalStorageItem('cart', JSON.stringify(this.cart));
      await this.addToMongodbCart(product, quantity);
    }
    this.route.navigate(['/cart']);
  }

  async addToMongodbCart(item: Product, quantity: number) {
    let currentUserToken = this.cookieInteractionService.getCookieItem('currentUser');
    currentUserToken = currentUserToken?.substring(1, currentUserToken.length - 1) as string;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentUserToken}`
    });
    const data = {
      "productId": item.id,
      "quantity": quantity
    }

    try {
      const response = await this.http
        .post("http://localhost:8093/cart/addCartProduct", JSON.stringify(data), { headers: headers, responseType: 'text' })
        .toPromise();
      console.log(response);
    } catch (error) {
      console.log("Failed post req|", error);
    }
  }

  itemInCart(product: any): boolean {
    return this.cart.some((item) => item.product.id === product.id);
  }

  async getCartItems(): Promise<CartItem[]> {
    let currentUserToken = this.cookieInteractionService.getCookieItem('currentUser');
    currentUserToken = currentUserToken?.substring(1, currentUserToken.length - 1) as string;
    if (currentUserToken) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${currentUserToken}`
      });

      try {
        const response = await this.http
          .get("http://localhost:8093/cart/getCart", { headers: headers })
          .toPromise();

        this.cart = response as CartItem[];
      } catch (error) {
        console.log(error);
        this.cart = [];
      }
    } else {
      this.cart = [];
    }

    return this.cart;
  }

  loadCart(): void {
    this.cart = JSON.parse(this.localStorageService.getLocalStorageItem('cart') as string);
  }

  // clearCart(): void {
  //   localStorage.removeItem('cartItem');
  //   this.cart = [];
  //   localStorage.removeItem('cartValue');
  // this.cartValue.next(0);
  // }

  async removeItem(id: number): Promise<void> {
    let currentUserToken = this.cookieInteractionService.getCookieItem('currentUser');
    currentUserToken = currentUserToken?.substring(1, currentUserToken.length - 1) as string;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentUserToken}`
    });
    const params = {
      "productId": id
    };

    try {
      await this.http
        .delete("http://localhost:8093/cart/deleteCartProduct", { headers: headers, params: params })
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  getTotal(): number {
    let total = 0;
    for (const item of this.cart) {
      total += item.quantity;
    }
    return total;
  }

  async changeQuantity(id: number, action: string): Promise<void> {
    let currentUserToken = this.cookieInteractionService.getCookieItem('currentUser');
    currentUserToken = currentUserToken?.substring(1, currentUserToken.length - 1) as string;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentUserToken}`
    });
    const params = {
      productId: id,
      action: action
    };

    try {
      await this.http
        .put("http://localhost:8093/cart/editCartProductQuantity", null, { params: params, headers: headers })
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }
}
