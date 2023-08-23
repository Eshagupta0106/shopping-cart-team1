import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { ProductComponent } from './product/product.component';
import { HomeComponent } from './home/home.component';
import { EmptyCartComponent } from './empty-cart/empty-cart.component';
import { FilledCartComponent } from './filled-cart/filled-cart.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: '/signIn', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'emptyCart', component: EmptyCartComponent },
  { path: 'cart', component: FilledCartComponent },
  { path: 'signIn', component: SignUpComponent },
  { path: 'thankYou', component: ThankyouComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
