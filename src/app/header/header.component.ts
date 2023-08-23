import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  searchText: string = '';
  constructor(private route: Router) {}
  category: string = '';

  navigateCart() {
    this.route.navigate(['/cart']);
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
    } else if (searchText.toLowerCase().includes('sticky note')) {
      return 'Sticky Notes';
    } else if (searchText.toLowerCase().includes('planner')) {
      return 'Planners';
    } else {
      return 'Not Found';
    }
  }

  navigateToCatalogWithoutQueryParams() {
    this.route.navigate(['/catalog']);
  }
  searchCategory() {
    if (this.searchText.trim().length != 0) {
      this.category = this.extractCategory(this.searchText);

      this.route.navigate(['/catalog'], {
        queryParams: { category: this.category, source: 'search' },
      });
    }

    this.searchText = '';
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
    localStorage.removeItem('user');
    this.route.navigate(['/signIn']);
  }
}
