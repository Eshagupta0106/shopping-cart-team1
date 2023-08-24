import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../product.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  searchText: string = '';
  private cartSubscription: Subscription;
  cartValue: number = 0;
  showProfile: boolean = true;
  isMenu: boolean = true;
  hideNotification: boolean = false;
  constructor(
    private route: Router,
    private cartService: CartService,
    private productService: ProductService
  ) {
    this.cartSubscription = this.cartService
      .getCartValue()
      .subscribe((value) => {
        this.cartValue = value;
      });
  }
  category: string = '';
  showProfileDropDown() {
    this.showProfile = !this.showProfile;
  }
  ngOnInit() {
    if (this.getUserEmail == null) {
      setTimeout(() => {
        this.hideNotification = true;
      }, 2000);
    }
  }
  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  navigateCart() {
    const userString = localStorage.getItem('userDetails');
    if (userString) {
      const userObject = JSON.parse(userString);
      const email = userObject.email;
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
    this.productService.isFilterApplied.next(true);
    this.route.navigate(['/catalog']);
    this.isMenu = !this.isMenu;
  }

  searchCategory() {
    if (this.searchText.trim().length != 0) {
      this.category = this.extractCategory(this.searchText);

      this.route.navigate(['/catalog'], {
        queryParams: { category: this.category, source: 'search' },
      });
    }

    this.searchText = '';
    this.isMenu = !this.isMenu;
  }

  getUserEmail(): string | null {
    const storedUser = localStorage.getItem('userDetails');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.firstName;
    }
    return null;
  }

  signOut(): void {
    this.hideNotification = true;
    localStorage.removeItem('user');
    this.showProfile = !this.showProfile;
    this.hideNotificationAfterDelay(1500);
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
    console.log(this.isMenu);
  }
}
