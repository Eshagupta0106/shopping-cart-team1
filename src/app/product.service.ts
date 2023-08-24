import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { CartItem } from './models/cartItem.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public isFilterApplied = new BehaviorSubject<boolean>(false);

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
      existingCartItem.quantity += quantity;
    } else {
      this.cart.push({ product, quantity });
    }
  }
  buyNow(product: any, quantity: number) {
    if (!this.itemInCart(product)) {
      this.cart.push({ product, quantity });
    }
    this.route.navigate(['/cart']);
  }

  itemInCart(product: any): boolean {
    const existingCartItem = this.cart.find(
      (item) => item.product.id === product.id
    );
    if (existingCartItem) {
      return true;
    } else {
      return false;
    }
  }
  getCartItems(): CartItem[] {
    return this.cart;
  }
}
