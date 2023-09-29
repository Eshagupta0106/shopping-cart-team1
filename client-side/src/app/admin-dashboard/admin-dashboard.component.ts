import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  Products: any = [];
  selectedAvailability: string = '';

  constructor(
    private productService: ProductService,
    private cookieService: CookieService,
    private router: Router
  ) { }
  ngOnInit() {

    this.productService.getProducts().subscribe((response: any) => {
      this.Products = response;
      this.Products.sort((a: { price: number }, b: { price: number }) => {
        return b.price - a.price;
      });
    });

  }

  deleteProduct(productToDelete: Product) {
    this.productService.deleteProduct(productToDelete.id).subscribe();
    const index = this.Products.findIndex(
      (hotel: { hotelId: any }) => hotel.hotelId === productToDelete.id
    );
    if (index !== -1) {
      this.Products.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.Products));
      this.Products = JSON.parse(localStorage.getItem('cart') as string);
    }
  }

 

  filterProducts() {
    if (this.selectedAvailability === '') {
      // If no availability filter is selected, show all products
      this.productService.getProducts().subscribe((response: any) => {
        this.Products = response;
        this.Products.sort((a: { price: number }, b: { price: number }) => {
          return b.price - a.price;
        });
      });
    } else {
      // If an availability filter is selected, filter products based on availability
      this.productService.getProducts().subscribe((response: any) => {
        this.Products = response.filter((product: Product) =>
          product.availability === this.selectedAvailability
        );
      });
    }
  }
}
