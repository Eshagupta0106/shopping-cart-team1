import { Component } from '@angular/core';
import { Filter } from '../models/filter.model';
import { Router } from '@angular/router';
import { FilterService } from '../service/filter.service';
@Component({
  selector: 'app-empty-cart',
  templateUrl: './empty-cart.component.html',
  styleUrls: ['./empty-cart.component.css'],
})
export class EmptyCartComponent {
  filterParams: Filter = {
    category: {},
    availability: 'All',
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
  }; 
  constructor(
    private route: Router,
    private filterService : FilterService
  ) { }
  navigateToCatalog(){
    this.filterParams.category = {};
    this.filterParams.availability = 'All';
    this.filterParams.minPrice = 0;
    this.filterParams.maxPrice = 5000;
    this.filterParams.minRating = 0;
    const filterQueryParams = JSON.stringify(this.filterParams);
    this.filterService.resetAppliedFilters();
    this.route.navigate(['/catalog'], { queryParams: { filterQueryParams } });
  }
}
