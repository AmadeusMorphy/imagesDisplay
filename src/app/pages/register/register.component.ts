import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(
    private userService: UserService,
    private http: HttpClient
  ){}

  users: {
    username: string;
    avatar: string;
    isReq: boolean
  }[] = []

  ngOnInit(): void {
this.testing()

const user = localStorage
console.log(user)
  }

  testing() {
    const apiUrl = 'https://rickandmortyapi.com/api/character'

    this.http.get(apiUrl).subscribe(
      (res: any) => {
        console.log(res)
        this.users = res.results.map((item: any) => {
          return {
            username: item.name,
            avatar: item.image,
            isReq: false
          }
        })
      }
    )
  }


  onSendReq(index: number) {
    this.users[index].isReq = true
    console.log(this.users[index])
  }
}
