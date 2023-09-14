import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CartItem } from '../models/cartItem.model';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { Filter } from '../models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiUrl = 'http://localhost:8093';
  constructor(private http: HttpClient, private route: Router) { }
  private cart: CartItem[] = [];

  loadProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/all`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  filterProducts(filters: Filter): Observable<Product[]> {
    let categoryParam = '';
    if (filters.category) {
      const selectedCategories = Object.keys(filters.category).filter(
        (key) => filters.category[key]
      );
      console.log(selectedCategories);
      if (selectedCategories.length > 0) {
        categoryParam = selectedCategories.join(',');
      }
      console.log(categoryParam);
    }
    const params = new HttpParams()
      .set('category', categoryParam)
      .set('availability', filters.availability)
      .set('minPrice', filters.minPrice.toString())
      .set('maxPrice', filters.maxPrice.toString())
      .set('minRating', filters.minRating ? filters.minRating.toString() : '');

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }


}


