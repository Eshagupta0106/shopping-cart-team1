import { Component, ViewChild } from '@angular/core';
import { CartItem } from '../models/cartItem.model';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  email: string = '';
  lastName: string = '';
  firstName: string = '';
  cart: CartItem[] = [];
  grand_total: number = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: Router
  ) {}
  ngOnInit() {
    this.cart = this.productService.getCartItems();
    this.calculateTotal();
    const userDetails = localStorage.getItem('userDetails');
    console.log(userDetails);
    if (userDetails) {
      const user = JSON.parse(userDetails);
      console.log(user);
      this.email = user.email;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
    }
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
    this.cartService.clearCart();
    this.productService.clearCart();
    this.route.navigate(['/thankYou']);
  }
}
