import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    this.profileForm.reset();
  }

  constructor(private route: Router) {}
  showAlert: boolean = true;
  showSignIn: boolean = false;
  showSignOut: boolean = true;
  alertMessage: string = '';

  user = { email: '', password: '' };
  userDetails = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  ngOnInit(): void {
    localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
  }

  signIn() {
    this.showAlert = true;
    this.user.email = this.profileForm.get('email')?.value ?? '';
    this.user.password = this.profileForm.get('password')?.value ?? '';
    if (
      this.user.email === this.userDetails.email &&
      this.user.password === this.userDetails.password
    ) {
      localStorage.setItem('user', JSON.stringify(this.user));
      this.route.navigate(['/home']);
    } else if (
      this.user.email === this.userDetails.email &&
      this.user.password != this.userDetails.password
    ) {
      this.showAlert = false;
      this.alertMessage = 'Password is wrong!';
    } else {
      this.showAlert = false;
      this.alertMessage = 'Not a Registered Member!';
    }
    this.onSubmit();
  }

  signUp() {
    this.showAlert = true;

    this.userDetails.email = this.profileForm.get('email')?.value ?? '';
    this.userDetails.password = this.profileForm.get('password')?.value ?? '';
    this.userDetails.firstName = this.profileForm.get('firstName')?.value ?? '';
    this.userDetails.lastName = this.profileForm.get('lastName')?.value ?? '';

    if (
      this.userDetails.email.trim().length == 0 ||
      this.userDetails.password.trim().length == 0
    ) {
      this.alertMessage = 'Fields are not filled';
      this.showAlert = false;
    } else if (
      this.user.email === this.userDetails.email &&
      this.user.email != null
    ) {
      this.alertMessage = 'User already have an account';
      this.showAlert = false;
    } else {
      localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
      this.user.email = this.userDetails.email;
      this.user.password = this.userDetails.password;
      localStorage.setItem('user', JSON.stringify(this.user));
      this.route.navigate(['/home']);
      this.showSignIn = !this.showSignIn;
      this.showSignOut = !this.showSignOut;
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
