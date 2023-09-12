import { Component, ViewChild, ElementRef } from '@angular/core';
import { Carousel, initTE } from 'tw-elements';

@Component({
  selector: 'app-home-quote',
  templateUrl: './home-quote.component.html',
  styleUrls: ['./home-quote.component.css'],
})
export class HomeQuoteComponent {
  @ViewChild('homeImage') homeImage?: ElementRef;
  ngOnInit() {
    initTE({ Carousel });
  }
  onImageHover() {
    if (this.homeImage) {
      this.homeImage.nativeElement.src = '../../assets/home2.jpg';
    }
  }

  onImageHoverExit() {
    if (this.homeImage) {
      this.homeImage.nativeElement.src = '../../assets/home.jpg';
    }
  }
}
