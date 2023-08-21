import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  storedDta: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = []
  categories: string[] = []
  constructor() { }

  ngOnInit(): void {
    const storedJsonData = localStorage.getItem('json_data');
    if (storedJsonData) {
      this.storedDta = JSON.parse(storedJsonData);
      this.storedDta.sort((a: { price: number; }, b: { price: number; }) => a.price - b.price);
      this.products = this.storedDta;
      this.filteredProducts = this.storedDta;
      this.categories = this.getDistinctCategories();
    }

  }
  getDistinctCategories(): string[] {
    return [...new Set(this.storedDta.map(product => product.category))];
  }
  applyFilter(filters: any) {
    this.filteredProducts = this.products.filter(product => {
      let categoryMatches = true;
      let priceMatches = true;
      let availabilityMatches = true;
      let ratingMatches = true;
      if (Object.values(filters.category).some(val => val === true)) {
        categoryMatches = Object.keys(filters.category).some(category => {
          return filters.category[category] && product.category === category;
        });
      }


      if (filters.minPrice !== null && filters.maxPrice !== null) {
        console.log(`Product Price: ${product.price}, Min Price: ${filters.minPrice}, Max Price: ${filters.maxPrice}`);
        priceMatches = product.price >= filters.minPrice && product.price <= filters.maxPrice;

        console.log(priceMatches);
        console.log("price works");
      }

      if (filters.availability == 'All') {
        availabilityMatches = true
      }
      else {
        availabilityMatches = product.availability === filters.availability;
      }
      if (filters.minRating) {
        const productRating = product.rating;
        ratingMatches = product.rating >= filters.minRating;

      }
      return categoryMatches && priceMatches && availabilityMatches && ratingMatches;

    });

    console.log('Filtered Products:', this.filteredProducts);
  }
  resetFilters() {
    this.filteredProducts = this.products;
  }
}

