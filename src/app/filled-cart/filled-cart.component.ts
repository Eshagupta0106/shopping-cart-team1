import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { CartItem } from '../models/cartItem.model';

@Component({
  selector: 'app-filled-cart',
  templateUrl: './filled-cart.component.html',
  styleUrls: ['./filled-cart.component.css'],
})
export class FilledCartComponent implements OnInit {
  cart: CartItem[] = [];
  grand_total: number = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cart = this.productService.getCartItems();
    this.calculateTotal();
  }

  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  removeAllItems(): void {
    this.cartService.clearCart();
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item);
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
