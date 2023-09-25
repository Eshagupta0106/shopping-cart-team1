import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CartItem } from '../models/cartItem.model';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { Filter } from '../models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  //private apiUrl = 'http://localhost:8093';
  private apiUrl = 'http://localhost:8095';
  constructor(private http: HttpClient, private route: Router) { }
  private cart: CartItem[] = [];
  private searchedProducts: Product[] = [];


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
      if (selectedCategories.length > 0) {
        categoryParam = selectedCategories.join(',');
      }
    }
    const params = new HttpParams()
      .set('category', categoryParam)
      .set('availability', filters.availability)
      .set('minPrice', filters.minPrice.toString())
      .set('maxPrice', filters.maxPrice.toString())
      .set('minRating', filters.minRating ? filters.minRating.toString() : '');

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  searchProducts(searchText: string): Observable<HttpResponse<Product[]>> {
    return this.http.get<Product[]>(`${this.apiUrl}/search`, {
      params: new HttpParams().set('query', searchText),
      observe: 'response',
    });
  }

  getSearchedProducts(): Product[] {
    return this.searchedProducts;
  }
  setSearchProducts(searchProducts: Product[]) {
    this.searchedProducts = searchProducts;
  }
}


