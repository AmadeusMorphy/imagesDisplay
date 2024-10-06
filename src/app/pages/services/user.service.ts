import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';

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
    return this.http.get<any>(`${this.apiUrl}`)
  }

  getCurrentUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`)
  }
  
  onLogin(email: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?email=${email}&password=${password}`)
  }


  
  sendFriendReq(userId: string, newFriendReq: { username: string, profileImg: string, email: string, id: string }): Observable<any> {
    return this.getCurrentUser(userId).pipe(
      switchMap(user => {
        // Ensure we are appending the new friend request to the existing ones
        const sendReq = user.friendRequests ? [...user.friendRequests, newFriendReq] : [newFriendReq];
        return this.http.put<any>(`${this.apiUrl}/${userId}`, { friendRequests: sendReq });
      })
    );
  }

  removeFriendReq(userId: string, friendReq: string): Observable<any> {
    return this.getCurrentUser(userId).pipe(
    switchMap(user => {
      const updatedFriendReq = user.friendRequests ? user.friendRequests.filter((req: { id: string}) => req.id !== friendReq) : [];
      return this.http.put<any>(`${this.apiUrl}/${userId}`, {...user, friendRequests: updatedFriendReq}).pipe(
        tap((updatedFriendReq: any) => {
          console.log('Friend req removed: ', updatedFriendReq)
        })
      )
    })
  )
  }
  acceptFriendReq(userId: string, acceptReq: { username: string, profileImg: string, email: string, id: string }): Observable<any> {
    return this.getCurrentUser(userId).pipe(
      switchMap(user => {
        // Ensure `user.friends` is always an array
        const friends = user.friends ? [...user.friends, acceptReq] : [acceptReq];
        return this.http.put<any>(`${this.apiUrl}/${userId}`, { friends });
      })
    );
  }
}
