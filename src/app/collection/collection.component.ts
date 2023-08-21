import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent {

  constructor(private router: Router) {}

  openCatalog(category: string){
    this.router.navigate(['/catalog'], { queryParams: { category: category } });
  }

}
