import { Component, EventEmitter, Input, Output,OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  @Input() categories: string[] = [];
  @Output() filterApplied = new EventEmitter<any>();
  @Output() filterCleared = new EventEmitter<any>();

  constructor(private productService: ProductService, private route : ActivatedRoute ) {}
  selectedCategory: { [category: string]: boolean } = {}
  selectedAvailability: string = 'All';
  minRatingError: boolean = false;
  priceRangeError:string | null = null;
  minPrice: number = 0;
  maxPrice: number = 5000;
  minRating: number | null = 0;
  
  isFilterButtonDisabled: boolean = false;
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
  }
  applyFilter() {
    const filters = {
      category: this.selectedCategory,
      availability: this.selectedAvailability,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minRating: this.minRating
    };
    this.productService.setAppliedFilters(filters);
    this.filterApplied.emit(filters);
  }
  validateMinRating() {
    if (this.minRating !== null && (this.minRating < 0 || this.minRating > 5)) {
      this.minRatingError = true;
      this.isFilterButtonDisabled = true;
    } else {
      this.minRatingError = false;
      this.isFilterButtonDisabled = false;
    }
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
      this.priceRangeError = "Price fields cannot be empty.";
      this.isFilterButtonDisabled = true;
      return false;
    } if (this.minPrice < 0) {
      this.resetMinPrice();
    } if (this.maxPrice < 0) {
      this.resetMaxPrice();
    } if (this.minPrice > this.maxPrice) {
      this.priceRangeError = "Min price cannot be greater than max price.";
      this.isFilterButtonDisabled = true;
      return false;
    } else {
      this.priceRangeError = null;
      this.isFilterButtonDisabled = false;
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
    this.isFilterButtonDisabled = false;
    this.filterCleared.emit();
  }
}








