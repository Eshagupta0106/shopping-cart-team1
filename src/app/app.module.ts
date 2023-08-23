import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CatalogComponent } from './catalog/catalog.component';
import { FilterComponent } from './filter/filter.component';
import { ProductService } from './product.service';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './product/product.component';
import { EmptyCartComponent } from './empty-cart/empty-cart.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CollectionComponent } from './collection/collection.component';
import { HomeQuoteComponent } from './home-quote/home-quote.component';
import { HomeComponent } from './home/home.component';
import { FilledCartComponent } from './filled-cart/filled-cart.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    CatalogComponent,
    FilterComponent,
    ProductComponent,
    EmptyCartComponent,
    HeaderComponent,
    FooterComponent,
    CollectionComponent,
    HomeQuoteComponent,
    HomeComponent,
    FilledCartComponent,
    SignUpComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  providers: [ProductService],
  bootstrap: [AppComponent],
})
export class AppModule {}
