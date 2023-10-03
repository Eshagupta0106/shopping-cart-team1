import { Injectable } from '@angular/core';
import { CookieInteractionService } from './cookieinteraction.service';
import { ProductService } from './product.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private userRoleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private isAdminSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private cookieInteractionService: CookieInteractionService,
    private http: HttpClient
  ) {
    this.initUserRole();
  }

  getCurrentUser() {
    if (this.cookieInteractionService.getCookieItem('currentUser')) {
      return JSON.parse(this.cookieInteractionService.getCookieItem('currentUser') as string);
    } else {
      return null;
    }
  }

  private initUserRole() {
    this.getCurrentUserRole().subscribe(
      (response) => {
        this.userRoleSubject.next(response.role);

        if (response.role === "ROLE_ADMIN") {
          console.log("User is an admin");
          this.isAdminSubject.next(true);
        } else {
          this.isAdminSubject.next(false);
        }
      },
      (error) => {
        console.error("Error getting user role", error);
        this.isAdminSubject.next(false);
      }
    );
  }

  isAdmin(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }

  getUserRole(): Observable<string> {
    return this.userRoleSubject.asObservable();
  }

  setRole(role: string) {
    this.userRoleSubject.next(role);
    if (role === "ROLE_ADMIN") {
      console.log("User is an admin");
      this.isAdminSubject.next(true);
    } else {
      this.isAdminSubject.next(false);
    }
  }

  getCurrentUserRole(): Observable<any> {
    let currentUserToken = this.cookieInteractionService.getCookieItem('currentUser');
    currentUserToken = currentUserToken?.substring(1, currentUserToken.length - 1) as string;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentUserToken}`
    });
    return this.http.get<any>(`http://localhost:8093/current-user`, { headers });
  }
}
