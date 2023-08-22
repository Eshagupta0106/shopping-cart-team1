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

  navigateCart() {
    localStorage.clear;
    if (localStorage.length != 0) {
      this.route.navigate(['/cart']);
    } else {
      this.route.navigate(['/emptyCart']);
    }
  }
  searchCategory() {
    this.route.navigate(['/catalog'], {
      queryParams: { category: this.searchText },
    });
    this.searchText = '';
  }
}
