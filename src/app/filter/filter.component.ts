import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FilterService } from '../service/filter.service';
import { Filter } from '../models/filter.model';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  @Input() categories: string[] = [];
  @Output() filterChanged = new EventEmitter<any>();
  @Input() filterParams: Filter = {
    category: {},
    availability: '',
    minPrice: 0,
    maxPrice: 0,
    minRating: 0,
  };
  selectedCategory: { [category: string]: boolean } = {};
  selectedAvailability: string = 'All';
  minRatingError: boolean = false;
  priceRangeError: string | null = null;
  minPrice: number = 0;
  maxPrice: number = 5000;
  minRating: number | null = 0;

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.selectedAvailability = 'All';
    this.filterService.getAppliedFilters().subscribe((filters) => {
      this.selectedCategory = filters?.category || {};
      this.selectedAvailability = filters?.availability || 'All';
      this.minPrice = filters?.minPrice || 0;
      this.maxPrice = filters?.maxPrice || 5000;
      this.minRating = filters?.minRating || 0;
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
    if (this.validatePriceRange() && !this.minRatingError) {
      this.filterService.setAppliedFilters(filters);
      this.filterChanged.emit(filters);
    }
  }

  validateMinRating() {
    if (this.minRating !== null && (this.minRating < 0 || this.minRating > 5)) {
      this.minRatingError = true;
    } else {
      this.minRatingError = false;
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
    this.filterService.clearAppliedFilters();
  }
}
