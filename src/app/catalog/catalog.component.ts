import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  storedDta: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  constructor(private route: ActivatedRoute) {}

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
      const category = params['category'];
      this.pageFilter(category);
    });
  }

  pageFilter(category: string) {
    if (category === 'Pen') {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.category === category ||
          product.category === 'Pencil' ||
          product.category === 'Highlighter'
      );
    } else if (category === 'Bookmark' || category === 'Eraser') {
      this.filteredProducts = this.products.filter(
        (product) => product.category === category
      );
    } else if (category === 'Book') {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.category === 'Notebooks' ||
          product.category === 'Planners' ||
          product.category === 'Sticky Notes'
      );
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
        console.log(
          `Product Price: ${product.price}, Min Price: ${filters.minPrice}, Max Price: ${filters.maxPrice}`
        );
        priceMatches =
          product.price >= filters.minPrice &&
          product.price <= filters.maxPrice;

        console.log(priceMatches);
        console.log('price works');
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

    console.log('Filtered Products:', this.filteredProducts);
  }
  resetFilters() {
    this.filteredProducts = this.products;
  }
}
