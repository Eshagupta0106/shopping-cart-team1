import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../service/cart.service';
import { Subscription } from 'rxjs';
import { Product } from '../models/product.model';
import { RegisterService } from '../service/register.service';
import { FilterService } from '../service/filter.service';
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
    private filterService: FilterService
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
    if (this.getUserName() == null) {
      setTimeout(() => {
        this.hideNotification = true;
      }, 2000);
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

  extractCategory(searchText: string): string {
    if (searchText.toLowerCase().includes('pencil')) {
      return 'Pencil';
    } else if (searchText.toLowerCase().includes('pen')) {
      return 'Pen';
    } else if (searchText.toLowerCase().includes('highlighter')) {
      return 'Highlighter';
    } else if (searchText.toLowerCase().includes('bookmark')) {
      return 'Bookmark';
    } else if (
      searchText.toLowerCase().includes('book') ||
      searchText.toLowerCase().includes('notebook')
    ) {
      return 'Notebooks';
    } else if (searchText.toLowerCase().includes('eraser')) {
      return 'Eraser';
    } else if (
      searchText.toLowerCase().includes('sticky note') ||
      searchText.toLowerCase().includes('sticky') ||
      searchText.toLowerCase().includes('note')
    ) {
      return 'Sticky Notes';
    } else if (searchText.toLowerCase().includes('planner')) {
      return 'Planners';
    } else {
      return 'Not Found';
    }
  }

  navigateToCatalogWithoutQueryParams() {
    this.filterService.isFilterApplied.next(true);
    this.filterService.clearAppliedFilters();
    this.route.navigate(['/catalog'], { queryParams: { category: 'All' } });
    this.isMenu = !this.isMenu;
  }

  searchCategory() {
    if (this.searchText.trim().length != 0) {
      this.category = this.extractCategory(this.searchText);
      this.filterService.isFilterApplied.next(false);
      this.route.navigate(['/catalog'], {
        queryParams: { category: this.category, source: 'search' },
      });
    }
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
    this.hideNotificationAfterDelay(1500);
    this.registerService.clearCurrentUser();
    this.route.navigate(['/signIn']);
  }

  onNotificationClick() {
    this.hideNotification = false;
  }

  hideNotificationAfterDelay(delay: number) {
    setTimeout(() => {
      this.hideNotification = false;
    }, delay);
  }

  showMenu() {
    this.isMenu = !this.isMenu;
  }
}
