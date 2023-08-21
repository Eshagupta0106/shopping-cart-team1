import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  constructor(private route: Router) {}

  navigateCart() {
    localStorage.clear
    if (localStorage.length != 0) {
      this.route.navigate(['/filledCart']);
    } else {
      this.route.navigate(['/emptyCart']);
    }
  }

}
