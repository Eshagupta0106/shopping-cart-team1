import { Injectable } from '@angular/core';
import { CookieInteractionService } from './cookieinteraction.service';
@Injectable({
  providedIn: 'root',
})
export class RegisterService {

  constructor(private cookieInteractionService: CookieInteractionService) { }


  getCurrentUser() {
    if (this.cookieInteractionService.getCookieItem('currentUser')) {
      return JSON.parse(this.cookieInteractionService.getCookieItem('currentUser') as string);
    }
    else {
      return null;
    }
  }

  isAdmin(): any {
    let role=localStorage.getItem("role")||'';
    if (role.includes("ADMIN")) {
      return true;
    }
    return false;
  }

  setRole(role:string) {
    localStorage.setItem("role",role);
  }
}
