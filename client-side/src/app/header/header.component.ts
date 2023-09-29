import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { FilterService } from '../service/filter.service';
import { CookieInteractionService } from '../service/cookieinteraction.service';
import { LocalstorageService } from '../service/localstorage.service';
import { ProductService } from '../service/product.service';
import { RegisterService } from '../service/register.service';
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
  showProfile: boolean = true;
  isMenu: boolean = true;
  hideNotification: boolean = false;
  category: string = '';
 isUserAdmin:Boolean = false;

  constructor(
    private route: Router,
    private filterService: FilterService,
    private cookieInteractionService: CookieInteractionService,
    private localStorageService: LocalstorageService,
    private productService: ProductService,
    private registerService:RegisterService
  ) {

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
    this.isUserAdmin = this.registerService.isAdmin();
  }


  showProfileDropDown() {
    this.showProfile = !this.showProfile;
  }

  navigateCart() {
    const user = this.cookieInteractionService.getCookieItem('currentUser');
    if (user) {
      this.route.navigate(['/cart']);
    } else {
      this.route.navigate(['/emptyCart']);
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

  signOut(): void {
    this.hideNotification = true;
    this.showProfile = !this.showProfile;
    this.cookieInteractionService.removeCookieItem('currentUser');
    if (this.localStorageService.getLocalStorageItem('cart')) {
      this.localStorageService.removeLocalStorageItem('cart');
    }
   this.filterService.resetAppliedFilters();
    setTimeout(() => {
      this.hideNotification = false;
      this.route.navigate(['/signIn']);
    }, 1000);
  }

  showMenu() {
    this.isMenu = !this.isMenu;
  }


}
