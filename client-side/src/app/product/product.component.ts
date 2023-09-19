import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../service/cart.service';
import { RegisterService } from '../service/register.service';
import { Product } from '../models/product.model';
import { FilterService } from '../service/filter.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  product!: Product;
  quantity: number = 1;
  Math: any;
  isItemCart: boolean = false;
  hideNotification: boolean = false;
  filterR: any = {};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private registerService: RegisterService,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const productId = +params['id'];
      this.productService.getProductById(productId).subscribe((product) => {
        this.product = product;
      });
    });
    this.route.queryParams.subscribe((queryParams) => {
      this.filterR = queryParams;
      console.log(this.filterR)
      if (this.filterR) {
        console.log("I am using product service");
       
    }});
  }

  navigateCategory() {
    this.filterService.filters.next(this.filterR);
    console.log("navigate category");
    this.route.queryParams.subscribe((queryParams) => {
     const filterQueryParams = queryParams;
      console.log(filterQueryParams);
    this.router.navigate(['/catalog'], {
      queryParams: {
       filterQueryParams
      }
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

  increaseQuantity() {
    this.quantity += 1;
  }

  async addToCart() {
    this.hideNotification = true;
    this.hideNotificationAfterDelay(1500);
    if (this.product && this.quantity) {
      await this.cartService.addToCart(this.product, this.quantity);
    }
  }

  hideNotificationAfterDelay(delay: number) {
    setTimeout(() => {
      this.hideNotification = false;
    }, delay);
  }

  async buyNow() {
    const userString = this.registerService.getCurrentUser();
    if (userString) {
      await this.cartService.buyNow(this.product, this.quantity);
    } else {
      this.router.navigate(['/signIn']);
    }
  }
}
