import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  getLocalStorageItem(searchKey: string): string | null {
    return localStorage.getItem(searchKey);
  }

  setLocalStorageItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  removeLocalStorageItem(key: string): void {
    localStorage.removeItem(key);
  }
}
