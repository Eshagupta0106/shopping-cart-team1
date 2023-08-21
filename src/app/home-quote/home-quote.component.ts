import { Component } from '@angular/core';
import {
  Carousel,
  initTE,
} from "tw-elements";


@Component({
  selector: 'app-home-quote',
  templateUrl: './home-quote.component.html',
  styleUrls: ['./home-quote.component.css']
})
export class HomeQuoteComponent {
  ngOnInit() {
    initTE({ Carousel });
  }

}
