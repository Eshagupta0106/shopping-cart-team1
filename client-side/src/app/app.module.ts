import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CatalogComponent } from './catalog/catalog.component';
import { FilterComponent } from './filter/filter.component';
import { ProductService } from './service/product.service';
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
import { CheckoutComponent } from './checkout/checkout.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminUpdateProductComponent } from './admin-update-product/admin-update-product.component';

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
    CheckoutComponent,
    ThankyouComponent,
    AdminPageComponent,
    AdminDashboardComponent,
    AdminUpdateProductComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule
    ],
  providers: [ProductService,CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
