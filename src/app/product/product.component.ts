import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  product: any;
  quantity: number = 1;
  Math: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const productId = +params['id'];
      this.productService.getProductById(productId).subscribe((product) => {
        this.product = product;
      });
    });
  }

  generateStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      '<i class="fas fa-star"></i>'.repeat(fullStars) +
      (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') +
      '<i class="far fa-star"></i>'.repeat(emptyStars)
    );
  }

  decreaseQuantity() {
    this.quantity = Math.max(this.quantity - 1, 1);
  }

  addToCart() {
    if (this.product && this.quantity) {
      this.productService.addToCart(this.product, this.quantity);
      this.cartService.increaseCartValue(1);
    }
  }

  buyNow() {
    const userString = localStorage.getItem('userDetails');
    if (userString) {
      const userObject = JSON.parse(userString);
      const email = userObject.email;
      if (email.trim().length != 0) {
        if (this.product && this.quantity) {
          this.productService.buyNow(this.product, this.quantity);
        }
      }
    } else {
      this.router.navigate(['/signIn']);
    }
  }
}
