import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
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
    this.productService.deleteProduct(productToDelete.id).subscribe(() => {
      const index = this.Products.findIndex(
        (product: { id: any }) => product.id === productToDelete.id
      );
      if (index !== -1) {
        this.Products.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(this.Products));
      }
      this.filterProducts();
    });
  }

 

  filterProducts() {
    if (this.selectedAvailability === '') {
      this.productService.getProducts().subscribe((response: any) => {
        this.Products = response;
        this.Products.sort((a: { price: number }, b: { price: number }) => {
          return b.price - a.price;
        });
      });
    } else {
      this.productService.getProducts().subscribe((response: any) => {
        this.Products = response.filter((product: Product) =>
          product.availability === this.selectedAvailability
        );
      });
    }
  }
}
