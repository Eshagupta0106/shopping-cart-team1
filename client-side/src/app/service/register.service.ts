import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  getUserDetail(email: string) {
    return JSON.parse(localStorage.getItem(email) as string);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') as string);
  }

  setCurrentUser(email: string) {
    const user = this.getUserDetail(email);

    const userDetail = {
      email: email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    localStorage.setItem('currentUser', JSON.stringify(userDetail));
  }
  clearCurrentUser() {
    localStorage.removeItem('currentUser');
  }
}
