import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../service/cart.service';
import { Product } from '../models/product.model';
import { Filter } from '../models/filter.model';
import { FilterService } from '../service/filter.service';
import { ProductService } from '../service/product.service';
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
    availability: 'All',
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
  };
  notifyValue: string = '';
  isSideBar: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private filterService: FilterService,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      const filtertest = queryParams;
      if (filtertest) {
        if(queryParams['filterQueryParams']){
          const paramValue = JSON.parse(queryParams['filterQueryParams'] as string);
          this.handleFilterChange(paramValue);
        }
      }
    });
    this.productService.getProducts().subscribe((product) => {
      this.products = product;
      this.categories = this.getDistinctCategories();
    });
    const filter = this.filterService.getAppliedFilters();
    if (!filter) {
      this.loadProducts();
    }
    this.route.queryParams.subscribe((params) => {
      const sourcePage = params['source'];
      const category = params['category'];

      if (sourcePage === 'search') {
        this.filteredProducts = this.productService.getSearchedProducts();
        if (this.filteredProducts.length > 0) {
          const categories = [...new Set(this.filteredProducts.map(product => product.category))];
          interface Category {
            [key: string]: boolean;
          }
          const categoryObject: Category = {};
          categories.forEach(category => {
            categoryObject[category] = true;
          });
          this.filterService.clearAppliedFilters();
          const filters = {
            category: categoryObject,
            availability: 'All',
            minPrice: 0,
            maxPrice: 5000,
            minRating: 0,
          };
          this.filterService.setAppliedFilters(filters);
          this.applyFilter(filters);
        } else {
          this.filteredProducts = [];
          const filters = {
            category: {},
            availability: 'All',
            minPrice: 0,
            maxPrice: 0,
            minRating: 0,
          }
          this.filterService.setAppliedFilters(filters);
          this.applyFilter(filters);
        }
      }
      else if (sourcePage === 'home') {
        if (category) {
          this.pageFilter(category);
        }
      } else if (category === 'All') {
        this.resetFilters();
      }
    });
  }
  loadProducts() {
    this.productService.getProducts().subscribe((product) => {
      this.products = product;
      this.filteredProducts = this.products;
      this.categories = this.getDistinctCategories();
    });
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
      this.applyFilter(filters);
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
      this.applyFilter(filters);
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
      this.applyFilter(filters);
    } else if (category.length != 0) {
      this.filteredProducts = [];
    }
  }

  getDistinctCategories(): string[] {
    return [...new Set(this.products.map((product) => product.category))];
  }

  applyFilter(filters: Filter) {
    this.filterService.isFilterApplied.next(true);
    this.filterParams = filters;
    const filterQueryParams = JSON.stringify(filters);
    this.productService.filterProducts(filters).subscribe((data) => {
      this.filteredProducts = data;
    });
    this.router.navigate(['/catalog'], { queryParams: { filterQueryParams } });
  }

  handleFilterChange(filters: Filter) {
    this.applyFilter(filters);
  }

  resetFilters() {
    this.filterService.isFilterApplied.next(false);
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
    const filterQueryParams = JSON.stringify(this.filterParams);
    const queryParams = {
      filterQueryParams
    };
    this.router.navigate(['/product', product.id], { queryParams });
  }

  async addToCart(item: Product) {
    if (item.availability === 'In Stock') {
      this.notifyValue = 'Item added to Cart';
      await this.cartService.addToCart(item, this.quantity);
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
