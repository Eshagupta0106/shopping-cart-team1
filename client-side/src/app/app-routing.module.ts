import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { ProductComponent } from './product/product.component';
import { HomeComponent } from './home/home.component';
import { EmptyCartComponent } from './empty-cart/empty-cart.component';
import { FilledCartComponent } from './filled-cart/filled-cart.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminUpdateProductComponent } from './admin-update-product/admin-update-product.component';
import { AdminGuard } from './AdminGuard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'emptyCart', component: EmptyCartComponent },
  { path: 'cart', component: FilledCartComponent },
  { path: 'signIn', component: SignUpComponent },
  { path: 'thankYou', component: ThankyouComponent },
  { path: 'checkout', component: CheckoutComponent },
  {path:'adminaddproduct', component:AdminPageComponent,canActivate: [AdminGuard]},
  {path:'admindashboard', component:AdminDashboardComponent,canActivate: [AdminGuard]},
  {path: 'adminupdate/:id', component: AdminUpdateProductComponent,canActivate: [AdminGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
