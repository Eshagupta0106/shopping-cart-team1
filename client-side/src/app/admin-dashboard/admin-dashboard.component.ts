import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';

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
    private router:Router
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
    this.productService.deleteProduct(productToDelete.id).subscribe(
      () => {
        const index = this.Products.findIndex(
          (product: { id: any }) => product.id === productToDelete.id
        );
        if (index !== -1) {
          this.Products.splice(index, 1);
        }
        this.filterProducts();
        this.router.navigate(['/admindashboard']);
      },
      (error) => {

        console.error('Error deleting product:', error);
      }
    );
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
