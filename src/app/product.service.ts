import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { CartItem } from './models/cartItem.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  searchProducts(searchText: string) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient, private route: Router) {}
  private cart: CartItem[] = [];

  loadProducts(): Observable<any> {
    return this.getProducts().pipe(
      catchError((error) => {
        console.error('Error loading products:', error);
        return [];
      })
    );
  }

  clearCart(): void {
    this.cart = [];
  }

  getFilteredProducts(searchText: string): Observable<any> {
    return this.loadProducts().pipe(
      map((products) =>
        products.filter((product: { category: string | string[] }) =>
          product.category.includes(searchText)
        )
      )
    );
  }

  getJSONData(): Observable<any> {
    return this.http.get('assets/product.json');
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>('assets/product.json');
  }

  getProductById(id: number): Observable<any> {
    return this.getProducts().pipe(
      map((products) => products.find((product) => product.id === id))
    );
  }

  addToCart(product: any, quantity: number): void {
    const existingCartItem = this.cart.find(
      (item) => item.product.id === product.id
    );
    if (existingCartItem) {
<<<<<<< Updated upstream
      existingCartItem.quantity += quantity;
=======
      existingCartItem.quantity+= quantity;
>>>>>>> Stashed changes
    } else {
      this.cart.push({ product, quantity });
    }
  }
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
  buyNow(product: any, quantity: number) {
    const existingCartItem = this.cart.find(
      (item) => item.product.id === product.id
    );
    if (!existingCartItem) {
      this.cart.push({ product, quantity });
    }
    this.route.navigate(['/cart']);
  }
  getCartItems(): CartItem[] {
    return this.cart;
  }
}
