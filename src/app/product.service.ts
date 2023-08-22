import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private http: HttpClient) { }
    private cart: { product: any, quantity: number }[] = [];

    getJSONData(): Observable<any> {
        return this.http.get('assets/product.json');
    }

    getProducts(): Observable<any[]> {
        return this.http.get<any[]>('assets/product.json');
    }

    getProductById(id: number): Observable<any> {
        return this.getProducts().pipe(
            map(products => products.find(product => product.id === id))
        );
    }

    addToCart(product: any, quantity: number): void {
        const existingCartItem = this.cart.find(item => item.product.id === product.id);
        if (existingCartItem) {
            existingCartItem.quantity = quantity;
        } else {
            this.cart.push({ product, quantity });
        }
    }

    getCartItems(): { product: any, quantity: number }[] {
        return this.cart;
    }
}

