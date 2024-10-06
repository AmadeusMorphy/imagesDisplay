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
  
  isClicked: boolean = false;
  ngOnInit(): void {

    this.getFriends()
  }

  getFriends() {
    
    this.currentId = localStorage.getItem('userId')

    this.userService.getCurrentUser(this.currentId).subscribe(
      (res: any) => {
        console.log('Current user: ', res)
        console.log("friends: ", res.friends)

        this.friends = res.friends?.map((item: any) => {
          return {
            id: item.id,
            username: item.username,
            profileImg: item.profileImg,
            email: item.email,
          }
        })
      }
    )
  }

  removeFriend(index: number) {

    this.userService.removeFriend(this.currentId, this.friends[index].id).subscribe(
      (res: any) => {
        console.log('Friend removed successfully: ', res)
        this.isClicked = true
      }
    )
  }

  onSendReq(index: number) {

    if(this.friends[index].id){
    console.log(this.friends[index])
    }
  }
}
