import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  storedDta: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];
  filteredItems: any[] = [];
  categories: string[] = [];
  quantity: number = 1;
  hideNotification: boolean = false;
  notifyValue: string = '';
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedJsonData = localStorage.getItem('json_data');
    if (storedJsonData) {
      this.storedDta = JSON.parse(storedJsonData);
      this.storedDta.sort(
        (a: { price: number }, b: { price: number }) => a.price - b.price
      );
      this.products = this.storedDta;
      this.filteredProducts = this.storedDta;
      this.categories = this.getDistinctCategories();
    }
    this.route.queryParams.subscribe((params) => {
      const sourcePage = params['source'];
      const category = params['category'];
      if (sourcePage == 'search') {
        if (category) {
          this.searchPageFilter(category.toLowerCase());
        }
      } else if (sourcePage === 'home') {
        if (category) {
          this.pageFilter(category.toLowerCase());
        }
      }
    });
  }

  searchPageFilter(category: string) {
    if (
      category === 'pen' ||
      category === 'pencil' ||
      category === 'highlighter' ||
      category === 'eraser' ||
      category === 'notebooks' ||
      category === 'planners' ||
      category === 'sticky notes' ||
      category === 'bookmark'
    ) {
      this.filteredProducts = this.products.filter(
        (product) => product.category.toLowerCase() === category
      );
    } else {
      this.filteredProducts = [];
    }
  }

  pageFilter(category: string) {
    if (
      category === 'pen' ||
      category === 'pencil' ||
      category === 'highlighter'
    ) {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.category.toLowerCase() === category ||
          product.category.toLowerCase() === 'pencil' ||
          product.category.toLowerCase() === 'highlighter'
      );
    } else if (category === 'bookmark' || category === 'eraser') {
      this.filteredProducts = this.products.filter(
        (product) => product.category.toLowerCase() === category
      );
    } else if (
      category === 'book' ||
      category === 'notebooks' ||
      category === 'planners' ||
      category === 'sticky notes'
    ) {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.category.toLowerCase() === 'notebooks' ||
          product.category.toLowerCase() === 'planners' ||
          product.category.toLowerCase() === 'sticky notes'
      );
    } else if (category.length != 0) {
      this.filteredProducts = [];
    }
  }

  getDistinctCategories(): string[] {
    return [...new Set(this.storedDta.map((product) => product.category))];
  }

  applyFilter(filters: any) {
    this.filteredProducts = this.products.filter((product) => {
      let categoryMatches = true;
      let priceMatches = true;
      let availabilityMatches = true;
      let ratingMatches = true;
      if (Object.values(filters.category).some((val) => val === true)) {
        categoryMatches = Object.keys(filters.category).some((category) => {
          return filters.category[category] && product.category === category;
        });
      }

      if (filters.minPrice !== null && filters.maxPrice !== null) {
        priceMatches =
          product.price >= filters.minPrice &&
          product.price <= filters.maxPrice;
      }

      if (filters.availability == 'All') {
        availabilityMatches = true;
      } else {
        availabilityMatches = product.availability === filters.availability;
      }
      if (filters.minRating) {
        const productRating = product.rating;
        ratingMatches = product.rating >= filters.minRating;
      }
      return (
        categoryMatches && priceMatches && availabilityMatches && ratingMatches
      );
    });
  }
  resetFilters() {
    this.filteredProducts = this.products;
  }
  goToHome() {
    this.router.navigate(['/home']);
  }
  addToCart(product: any) {
    if (product.availability === 'In Stock') {
      this.notifyValue = 'Item added to Cart';
      this.productService.addToCart(product, this.quantity);
      this.cartService.increaseCartValue(this.quantity);
    } else {
      this.notifyValue = 'Item not in Stock';
    }
    this.hideNotification = true;
    this.hideNotificationAfterDelay(1500);
  }
  hideNotificationAfterDelay(delay: number) {
    setTimeout(() => {
      this.hideNotification = false;
    }, delay);
  }
}
