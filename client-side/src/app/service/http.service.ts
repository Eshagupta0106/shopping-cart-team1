import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) { }
  mainUrl = 'http://localhost:8093';
  postData(url: string, data: object): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post(this.mainUrl + url, data, { headers: headers, responseType: 'text' });
  }
  getUser(email: string): Observable<string> {
    let params = new HttpParams();
    params = params.set('email', email);
    return this.http.get(this.mainUrl + '/auth/getUser', {
      params: params,
      responseType: 'text'
    });
  }
  
}
