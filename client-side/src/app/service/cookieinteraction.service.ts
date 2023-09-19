import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
    providedIn: 'root'
})
export class CookieInteractionService {

    constructor(private cookieService: CookieService) { }

    getCookieItem(searchKey: string): string | null {
        return this.cookieService.get(searchKey);
    }

    setCookieItem(key: string, value: string): void {
        this.cookieService.set(key, value);
    }
    removeCookieItem(key: string): void {
        this.cookieService.delete(key);
    }
}
