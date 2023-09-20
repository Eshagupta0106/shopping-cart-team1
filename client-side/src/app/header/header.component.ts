import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../service/cart.service';
import { Subscription } from 'rxjs';
import { Product } from '../models/product.model';
import { RegisterService } from '../service/register.service';
import { FilterService } from '../service/filter.service';
import { CookieService } from 'ngx-cookie-service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  storedDta: Product[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchText: string = '';
  private cartSubscription: Subscription;
  cartValue: number = 0;
  showProfile: boolean = true;
  isMenu: boolean = true;
  hideNotification: boolean = false;
  category: string = '';

  constructor(
    private route: Router,
    private cartService: CartService,
    private registerService: RegisterService,
    private filterService: FilterService,
    private cookieService: CookieService,
    private productService: ProductService
  ) {
    this.cartSubscription = this.cartService.cartValue.subscribe((value) => {
      this.cartValue = value;
    });
  }

  ngOnInit() {
    const storedJsonData = localStorage.getItem('json_data');
    if (storedJsonData) {
      this.storedDta = JSON.parse(storedJsonData);
      this.storedDta.sort(
        (a: { price: number }, b: { price: number }) => a.price - b.price
      );
      this.products = this.storedDta;
      this.filteredProducts = this.storedDta;
    }
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  showProfileDropDown() {
    this.showProfile = !this.showProfile;
  }

  navigateCart() {
    const userString = this.registerService.getCurrentUser();
    if (userString) {
      const email = userString.email;
      if (email.trim().length != 0) {
        this.route.navigate(['/cart']);
      } else {
        this.route.navigate(['/signIn']);
      }
    } else {
      this.route.navigate(['/signIn']);
    }
  }

  navigateToCatalogWithoutQueryParams() {
    this.filterService.isFilterApplied.next(true);
    this.filterService.clearAppliedFilters();
    this.route.navigate(['/catalog'], { queryParams: { category: 'All' } });
    this.isMenu = !this.isMenu;
  }

  searchCategory() {
    this.filterService.isFilterApplied.next(false);
    this.productService.searchProducts(this.searchText).subscribe((response) => {
      const searchProducts = response.body;
      if (searchProducts != null) {
        this.productService.setSearchProducts(searchProducts);
      }
      this.route.navigate(['/catalog'], {
        queryParams: {
          source: 'search',
        },
      });
    });
    this.searchText = '';
    this.isMenu = !this.isMenu;
  }

  getUserName(): string | null {
    const currentUser = this.registerService.getCurrentUser();
    if (currentUser) {
      return currentUser.firstName;
    }
    return null;
  }

  signOut(): void {
    this.hideNotification = true;
    this.showProfile = !this.showProfile;
    this.cookieService.delete('currentUser');
    setTimeout(() => {
      this.hideNotification = false;
      this.route.navigate(['/signIn']);
    }, 1000);
  }

  showMenu() {
    this.isMenu = !this.isMenu;
  }
}
