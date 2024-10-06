import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent {

  currentId: any;
  constructor(
    private userService: UserService
  ){}

  friends: {
    id: string,
    username: string,
    profileImg: string,
    email: string,
  }[] = []

  ngOnInit(): void {

    this.getFriends()
  }

  getFriends() {
    
    this.currentId = localStorage.getItem('userId')

    this.userService.getCurrentUser(this.currentId).subscribe(
      (res: any) => {
        console.log("friends: ", res.friends)

        this.friends = res.friends?.map((item: any) => {
          return {
            id: item.id,
            username: item.username,
            profileImg: item.profileImg,
            email: item.email
          }
        })
      }
    )
  }
}
