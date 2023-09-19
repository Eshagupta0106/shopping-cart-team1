import { Component } from '@angular/core';
import { CartItem } from '../models/cartItem.model';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import { RegisterService } from '../service/register.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  // email: string = '';
  // lastName: string = '';
  // firstName: string = '';
  cart: CartItem[] = [];
  grand_total: number = 0;
  hideNotification: boolean = false;

  constructor(
    private cartService: CartService,
    private route: Router,
    private registerService: RegisterService
  ) { }

  ngOnInit() {
    this.cartService.loadCart();
    this.cart = this.cartService.cart;
    this.calculateTotal();
    // const currentUser = this.registerService.getCurrentUser();
    // if (currentUser) {
    //   this.email = currentUser.email;
    //   this.firstName = currentUser.firstName;
    //   this.lastName = currentUser.lastName;
    // }
    if (this.cart.length == 0) {
      this.route.navigate(['/home']);
    }
  }

  getTotalQuantity(): number {
    let qty = 0;
    for (let i = 0; i < this.cart.length; i++) {
      qty += this.cart[i].quantity;
    }
    return qty;
  }

  calculateTotal(): number {
    let total = 0;
    for (let i = 0; i < this.cart.length; i++) {
      total += this.cart[i].product.price * this.cart[i].quantity;
    }
    return total;
  }

  onSubmit() {
    // this.cartService.clearCart();
    setTimeout(() => {
      this.route.navigate(['/thankYou']);
    }, 600);

    this.hideNotification = true;
    this.hideNotificationAfterDelay(500);
  }

  hideNotificationAfterDelay(delay: number) {
    setTimeout(() => {
      this.hideNotification = false;
    }, delay);
  }
}
