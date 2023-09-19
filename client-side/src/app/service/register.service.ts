import { Injectable } from '@angular/core';
import { CookieInteractionService } from './cookieinteraction.service';
@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private cookieInteractionService : CookieInteractionService){}


  getCurrentUser() {
    if(this.cookieInteractionService.getCookieItem('currentUser')){
      return JSON.parse(this.cookieInteractionService.getCookieItem('currentUser') as string);
    }
    else{
      return null;
    }
  }
}
