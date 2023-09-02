import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { CartService } from '../service/cart.service';
import { Product } from '../models/product.model';
import { Filter } from '../models/filter.model';
import { FilterService } from '../service/filter.service';
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  storedDta: Product[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  quantity: number = 1;
  hideNotification: boolean = false;
  filterParams: Filter = {
    category: {},
    availability: '',
    minPrice: 0,
    maxPrice: 0,
    minRating: 0
  };
  notifyValue: string = '';
  isSideBar: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private filterService: FilterService,
  ) { }

  ngOnInit(): void {
    const storedJsonData = localStorage.getItem('json_data');
    if (storedJsonData) {
      this.storedDta = JSON.parse(storedJsonData);
      this.storedDta.sort(
        (a: { price: number }, b: { price: number }) => a.price - b.price
      );
      this.products = this.storedDta;
      this.filteredProducts = this.storedDta;
    }
    this.categories = this.getDistinctCategories();
    this.filterService.getAppliedFilters().subscribe((filters) => {
      if (filters) {
        this.filterParams = filters;
        this.applyFilter(this.filterParams);
      }
      else {
        this.resetFilters();
      }
    });
    this.route.queryParams.subscribe((params) => {
      const sourcePage = params['source'];
      const category = params['category'];
      if (sourcePage == 'search') {
        if (category) {
          this.searchPageFilter(category);
        }
      } else if (sourcePage === 'home') {
        if (category) {
          this.pageFilter(category);
        }
      } else if (category === 'All') {
        this.resetFilters();
      }
    });
  }

  searchPageFilter(category: string) {
    this.filterService.clearAppliedFilters();
    if (
      category === 'Pen' ||
      category === 'Pencil' ||
      category === 'Highlighter' ||
      category === 'Eraser' ||
      category === 'Notebooks' ||
      category === 'Planners' ||
      category === 'Sticky Notes' ||
      category === 'Bookmark'
    ) {
      const storedJsonData = localStorage.getItem('json_data');
      if (storedJsonData) {
        this.storedDta = JSON.parse(storedJsonData);
      }
      this.filteredProducts = this.storedDta.filter(
        (product) => product.category === category
      );
      const filters = {
        category: {
          [category]: true,
        },
        availability: 'All',
        minPrice: 0,
        maxPrice: 5000,
        minRating: 0,
      };
      this.filterService.setAppliedFilters(filters);
    } else {
      this.filteredProducts = [];
    }
  }

  openSideBar() {
    this.isSideBar = !this.isSideBar;
  }

  pageFilter(category: string) {
    if (
      category === 'Pen' ||
      category === 'Pencil' ||
      category === 'Highlighter'
    ) {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.category === category ||
          product.category === 'Pencil' ||
          product.category === 'Highlighter'
      );
      const filters = {
        category: {
          Pen: true,
          Pencil: true,
          Highlighter: true,
        },
        availability: 'All',
        minPrice: 0,
        maxPrice: 5000,
        minRating: 0,
      };
      this.filterService.setAppliedFilters(filters);
    } else if (category === 'Bookmark' || category === 'Eraser') {
      this.filteredProducts = this.products.filter(
        (product) => product.category === category
      );
      const filters = {
        category: {
          [category]: true,
        },
        availability: 'All',
        minPrice: 0,
        maxPrice: 5000,
        minRating: 0,
      };
      this.filterService.setAppliedFilters(filters);
    } else if (
      category === 'Book' ||
      category === 'Notebooks' ||
      category === 'Planners' ||
      category === 'Sticky Notes'
    ) {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.category === 'Notebooks' ||
          product.category === ' Planners' ||
          product.category === 'Sticky Notes'
      );
      const filters = {
        category: {
          Notebooks: true,
          Planners: true,
          'Sticky Notes': true,
        },
        availability: 'All',
        minPrice: 0,
        maxPrice: 5000,
        minRating: 0,
      };
      this.filterService.setAppliedFilters(filters);
    } else if (category.length != 0) {
      this.filteredProducts = [];
    }
  }

  getDistinctCategories(): string[] {
    return [...new Set(this.storedDta.map((product) => product.category))];
  }

  applyFilter(filters: Filter) {
    this.filterService.isFilterApplied.next(false);
    this.filterParams = filters;
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

  handleFilterChange(filters: Filter) {
    this.applyFilter(filters);
  }

  resetFilters() {
    this.filterService.isFilterApplied.next(true);
    this.filterParams.category = {};
    this.filterParams.availability = 'All';
    this.filterParams.minPrice = 0;
    this.filterParams.maxPrice = 5000;
    this.filterParams.minRating = 0;
    this.filteredProducts = this.products;
    this.applyFilter(this.filterParams);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  navigateToProduct(product: Product) {
    const queryParams = {
      id: product.id,
      filters: JSON.stringify(this.filterParams),
    };
    this.router.navigate(['/product', product.id], { queryParams });
  }

  addToCart(product: Product) {
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
