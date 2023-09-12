import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { CartItem } from '../models/cartItem.model';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { Filter } from '../models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiUrl = '/products';
  constructor(private http: HttpClient, private route: Router) { }
  private cart: CartItem[] = [];

  loadProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

 /* getFilteredProducts(searchText: string): Observable<Product> {
    return this.loadProducts().pipe(
      map((products) =>
        products.filter((product: { category: string | string[] }) =>
          product.category.includes(searchText)
        )
      )
    );
  }*/
  
  /*getFilteredProducts(category: string): Observable<Product[]> {
    // Call the Spring Boot API endpoint with the specified category
    return this.http.get<Product[]>(`${this.apiUrl}/search?category=${category}`);}*/

  /*getJSONData(): Observable<any> {
    return this.http.get('assets/product.json');
  }*/

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('${this.apiUrl}/all');
  }

  getProductById(id: number): Observable<any> {
   return this.http.get<Product>('${this.apiUrl}/${id}}');
  }

  /*getFilteredProducts(filters: Filter) {
    const params = new HttpParams()
  .set('category', JSON.stringify(filters.category))
  .set('availability', filters.availability)
  .set('minPrice', filters.minPrice.toString())
  .set('maxPrice', filters.maxPrice.toString())
  .set('minRating', filters.minRating?.toString());
    const url = `${this.apiUrl}/filter`;
    return this.http.get<Product[]>(url, { params: filters });
  }*/
  getFilteredProducts(filters:any): Observable<any[]> {
    const url = `${this.apiUrl}/products`; 
    const params = { filters }; 
  
    return this.http.get<Product[]>(url, { params });
  }
    
   
  }


