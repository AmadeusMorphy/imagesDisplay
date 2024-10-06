import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }


  private apiUrl = 'https://66fbddf48583ac93b40d8ce0.mockapi.io/users/login'
  private userApi = 'https://66fbddf48583ac93b40d8ce0.mockapi.io/users/users'
  getUser(): Observable<any> {
    return this.http.get<any>(`${this.userApi}`)
  }
  
  onLogin(email: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?email=${email}&password=${password}`)
  }
}
