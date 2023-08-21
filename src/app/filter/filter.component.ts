import { Component, EventEmitter, Input, Output,OnInit } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  @Input() categories: string[] = [];
  @Output() filterApplied = new EventEmitter<any>();
  @Output() filterCleared = new EventEmitter<any>();

  selectedCategory: { [category: string]: boolean } = {}
  selectedAvailability: string = 'All';
  minRatingError: boolean = false;
  priceRangeError:boolean = false;
  minPrice: number = 0;
  maxPrice: number | null = null;
  minRating: number | null = null;
  
  ngOnInit(): void {
    this.selectedAvailability = 'All';
  }
  applyFilter() {
    const filters = {
      category: this.selectedCategory,
      availability: this.selectedAvailability,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minRating: this.minRating
    };
    this.filterApplied.emit(filters);
  }
  validateMinRating() {
    if (this.minRating !== null && (this.minRating < 0 || this.minRating > 5)) {
      this.minRatingError = true;
    } else {
      this.minRatingError = false;
    }
  } 
  validatePriceRange(){
    if (this.minPrice !== null && this.maxPrice !== null && (this.minPrice < 0 || this.minPrice > this.maxPrice)) {
      this.priceRangeError = true;
    } else {
      this.priceRangeError = false;
    }
  }
  


  clearFilters() {
    this.selectedCategory = {};
    this.selectedAvailability = 'All';
    this.minPrice = 0;
    this.maxPrice = null;
    this.minRating = null;

    
    this.filterCleared.emit();
  }
}








