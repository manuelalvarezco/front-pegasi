import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://young-sands-07814.herokuapp.com/api';

  constructor(
    private http: HttpClient,
    private store: Store<AppState>) { }

  login(data: any){
    return this.http.post(`${this.url}/auth/login`,{email: data.email, password: data.password})
  }

}
