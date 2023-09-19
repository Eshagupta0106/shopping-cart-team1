import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../service/http.service';
import { CookieInteractionService } from '../service/cookieinteraction.service';
import { LocalstorageService } from '../service/localstorage.service';
import { CartService } from '../service/cart.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  hideNotification: boolean = false;
  notifyValue: string = '';
  onSubmit() {
    this.profileForm.reset();
  }

  constructor(
    private route: Router,
    private httpService: HttpService,
    private cartService: CartService,
    private cookieInteractionService: CookieInteractionService,
    private localStorageService: LocalstorageService
  ) { }
  showAlert: boolean = true;
  showSignIn: boolean = false;
  showSignOut: boolean = true;
  alertMessage: string = '';

  ngOnInit(): void { }

  async signIn() {
    this.showAlert = true;
    this.email = this.profileForm.get('email')?.value ?? '';
    this.password = this.profileForm.get('password')?.value ?? '';
    const user = {
      'email': this.email,
      'password': this.password
    };

    try {
      const response = await this.httpService.postData('/auth/logIn', user).toPromise();
      const userDetail = response;
      if (userDetail != "Credentials Invalid !!") {
        this.hideNotification = true;
        this.notifyValue = ' You have been successfully logged in';
        this.cookieInteractionService.setCookieItem('currentUser', JSON.stringify(JSON.parse(userDetail).jwttoken));
        await this.cartService.getCartItems();
        this.localStorageService.setLocalStorageItem('cart', JSON.stringify(this.cartService.cart));
        setTimeout(() => {
          this.route.navigate(['/home']);
        }, 1000);
      } else {
        this.showAlert = false;
        this.alertMessage = 'Invalid credentials..!';
      }
    } catch (error) {
      console.log(error);
    }

    this.onSubmit();
  }
  async signUp() {
    this.showAlert = true;
    this.email = this.profileForm.get('email')?.value ?? '';
    const userInfo = {
      email: this.email,
      password: this.profileForm.get('password')?.value as string,
      firstName: this.profileForm.get('firstName')?.value as string,
      lastName: this.profileForm.get('lastName')?.value as string,
    };

    try {
      const user = await this.httpService.getUser(this.email).toPromise();
      if (this.email.trim().length == 0 || userInfo.password.trim().length == 0) {
        this.alertMessage = 'Fields are not filled';
        this.showAlert = false;
      } else if (user) {
        this.alertMessage = 'User already has an account';
        this.showAlert = false;
      } else {
        const response = await this.httpService.postData('/auth/signUp', userInfo).toPromise();
        this.cookieInteractionService.setCookieItem('currentUser', JSON.stringify(JSON.parse(response).jwttoken));
        await this.cartService.getCartItems();
        this.localStorageService.setLocalStorageItem('cart', JSON.stringify(this.cartService.cart));
        this.hideNotification = true;
        this.notifyValue = 'Welcome to our website ' + userInfo.firstName;
        setTimeout(() => {
          this.route.navigate(['/home']);
        }, 1000);
      }
    } catch (error) {
      console.log("Error:", error);
    }

    this.onSubmit();
  }

  register() {
    this.onSubmit();
    this.showAlert = true;
    this.showSignIn = !this.showSignIn;
    this.showSignOut = !this.showSignOut;
  }

  closeAlert() {
    this.showAlert = !this.showAlert;
  }
}
