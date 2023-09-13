import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../service/register.service';
import { HttpService } from '../service/http.service';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';

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
    private registerService: RegisterService,
    private httpService: HttpService,
    private cookieService: CookieService
  ) { }
  showAlert: boolean = true;
  showSignIn: boolean = false;
  showSignOut: boolean = true;
  alertMessage: string = '';

  ngOnInit(): void { }

  signIn() {
    this.showAlert = true;
    this.email = this.profileForm.get('email')?.value ?? '';
    this.password = this.profileForm.get('password')?.value ?? '';
    let userDetail = null;
    this.httpService.getUser(this.email).subscribe(
      (response) => {
        userDetail = response;
        if (userDetail) {
          if ((userDetail as User).password === this.password) {
            this.hideNotification = true;
            this.notifyValue = ' You have been successfully logged in';
            this.cookieService.set('currentUser', JSON.stringify(userDetail));
            // const userString = this.cookieService.get('currentUser');
            // if (userString) {
            //   const user = JSON.parse(userString);
            //   console.log(user)
            // } else {
            //   console.log("Not logged in");
            // }
            setTimeout(() => {
              this.route.navigate(['/home']);
            }, 1000);
          } else {
            this.showAlert = false;
            this.alertMessage = 'Password is wrong!';
          }
        } else {
          this.showAlert = false;
          this.alertMessage = 'Not a Registered Member!';
        }
      },
      (error) => {
        console.log("Couldn't get user|", error);
      }
    )
    this.onSubmit();
  }

  signUp() {
    this.showAlert = true;
    this.email = this.profileForm.get('email')?.value ?? '';
    const userInfo = {
      email: this.email,
      password: this.profileForm.get('password')?.value as string,
      firstName: this.profileForm.get('firstName')?.value as string,
      lastName: this.profileForm.get('lastName')?.value as string,
    };
    let user = null;
    this.httpService.getUser(this.email).subscribe(
      (response) => {
        user = response;
        if (this.email.trim().length == 0 || userInfo.password.trim().length == 0) {
          this.alertMessage = 'Fields are not filled';
          this.showAlert = false;
        } else if (user) {
          this.alertMessage = 'User already have an account';
          this.showAlert = false;
        } else {
          this.httpService.postData('/createUser', userInfo).subscribe(
            (response) => {
              if (!response || !response.startsWith('Created user successfully')) {
                console.log("Failed to create user");
              }
              else {
                this.cookieService.set('currentUser', JSON.stringify(userInfo));
              }
            },
            (error) => {
              if (error.status === 500) {
                console.log("Server error: Failed to create user");
              } else {
                console.log("Couldn't create user|", error.message);
              }
            }
          );
          this.hideNotification = true;
          this.notifyValue = 'Welcome to our website ' + userInfo.firstName;
          setTimeout(() => {
            this.route.navigate(['/home']);
          }, 1000);
        }
      },
      (error) => {
        console.log("Couldn't get user|", error);
      }
    )
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
