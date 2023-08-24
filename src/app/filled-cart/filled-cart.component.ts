import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
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
  showNotification: boolean = false;
  @ViewChild('productImage') productImage?: ElementRef;

  originalImageSrc: string = '';
  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cart = this.productService.getCartItems();
    this.calculateTotal();
  }

  onImageHover(product: any) {
    if (this.productImage) {
      this.productImage.nativeElement.src = product.image[1];
    }
  }

  onImageHoverExit(product: any) {
    if (this.productImage) {
      this.productImage.nativeElement.src = product.image[0];
    }
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
