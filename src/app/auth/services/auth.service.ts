import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { AppState } from '../../app.reducer';
import { User } from '../../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.API_URL;

  constructor( private http: HttpClient) { }

  login(data: any){
    return this.http.post<User>(`${this.url}/login`,{email: data.email, password: data.password})
  }

  register(user: User){
    return this.http.post<User>(`${this.url}/register`, user)
  }

}
