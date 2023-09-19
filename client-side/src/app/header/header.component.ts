import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { FilterService } from '../service/filter.service';
import { CookieInteractionService } from '../service/cookieinteraction.service';
import { LocalstorageService } from '../service/localstorage.service';
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

  constructor(
    private route: Router,
    private filterService: FilterService,
    private cookieInteractionService: CookieInteractionService,
    private localStorageService: LocalstorageService
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
  }


  showProfileDropDown() {
    this.showProfile = !this.showProfile;
  }

  navigateCart() {
    const user = JSON.parse(this.cookieInteractionService.getCookieItem('currentUser') as string);
    if (user) {
      this.route.navigate(['/cart']);
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

  signOut(): void {
    this.hideNotification = true;
    this.showProfile = !this.showProfile;
    this.cookieInteractionService.removeCookieItem('currentUser');
    if (this.localStorageService.getLocalStorageItem('cart')) {
      this.localStorageService.removeLocalStorageItem('cart');
    }
    setTimeout(() => {
      this.hideNotification = false;
      this.route.navigate(['/signIn']);
    }, 1000);
  }

  showMenu() {
    this.isMenu = !this.isMenu;
  }
}
