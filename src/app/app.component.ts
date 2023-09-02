import { Component, OnInit } from '@angular/core';
import { ProductService } from './service/product.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'shopping-cart';
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.productService.getJSONData().subscribe((product) => {
      localStorage.setItem('json_data', JSON.stringify(product));
    });
  }
}
