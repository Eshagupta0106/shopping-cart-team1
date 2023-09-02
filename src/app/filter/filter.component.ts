import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  @Input() categories: string[] = [];
  @Output() filterChanged = new EventEmitter<any>();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}
  selectedCategory: { [category: string]: boolean } = {};
  selectedAvailability: string = 'All';
  minRatingError: boolean = false;
  priceRangeError: string | null = null;
  minPrice: number = 0;
  maxPrice: number = 5000;
  minRating: number | null = 0;

 
  ngOnInit(): void {
    this.selectedAvailability = 'All';
    const storedFilters = this.productService.getAppliedFilters();
    if (storedFilters) {
      this.selectedCategory = storedFilters.category || {};
      this.selectedAvailability = storedFilters.availability || 'All';
      this.minPrice = storedFilters.minPrice || 0;
      this.maxPrice = storedFilters.maxPrice || 5000;
      this.minRating = storedFilters.minRating || 0;
    }
    this.productService.isFilterApplied.subscribe((value) => {
      if (value) {
        this.clearFilters();
      }
    });
  }
  applyFilter() {
    const filters = {
      category: this.selectedCategory,
      availability: this.selectedAvailability,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minRating: this.minRating,
    };
    this.productService.setAppliedFilters(filters);
    this.filterChanged.emit(filters);
  }
  validateMinRating() {
    if (this.minRating !== null && (this.minRating < 0 || this.minRating > 5)) {
      this.minRatingError = true;
    } else {
      this.minRatingError = false;
    }
    this.applyFilter();
  }
  resetMinPrice() {
    this.minPrice = 0;
    this.validatePriceRange();
  }
  resetMaxPrice() {
    this.maxPrice = 5000;
    this.validatePriceRange();
  }
  validatePriceRange(): boolean {
    if (this.minPrice === null || this.maxPrice === null) {
      this.priceRangeError = 'Price fields cannot be empty.';
      return false;
    }
    if (this.minPrice < 0) {
      this.resetMinPrice();
    }
    if (this.maxPrice < 0) {
      this.resetMaxPrice();
    }
    if (this.minPrice > this.maxPrice) {
      this.priceRangeError = 'Min price cannot be greater than max price.';
      return false;
    } else {
      this.priceRangeError = null;
      return true;
    }
  }

  clearFilters() {
    this.productService.clearAppliedFilters();
    this.selectedCategory = {};
    this.selectedAvailability = 'All';
    this.minPrice = 0;
    this.maxPrice = 5000;
    this.minRating = 0;
    this.validatePriceRange();
    this.applyFilter();
  }
}
