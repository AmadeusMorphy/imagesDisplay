import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss']
})
export class AddFriendComponent {

  constructor(
    private userService: UserService
  ){}

  currentUserBlock: {
    username: string,
    profileImg: string,
    email: string,
    id: string
  }[] = []

  currentUserId: any;
  users: {
    username: string,
    profileImg: string,
    isReq: boolean,
    id: string,

  }[] = []

  ngOnInit(): void {
    
    this.getUsers()

    this.getCurrentUser()
  }

  getCurrentUser() {
    this.currentUserId = localStorage.getItem('userId')
    this.userService.getCurrentUser(this.currentUserId).subscribe(
      (res: any) => {
        console.log('Your logged in as: ', res)
        this.currentUserBlock.push({
          username: res.username,
          profileImg: res.profileImg,
          email: res.email,
          id: res.id
        });
         console.log(this.currentUserBlock)
      }
    )
  }

  getUsers() {
    this.userService.getUser().subscribe(
      (res: any) => {
        console.log(res)
        this.users = res.map((item: any) => {
          return {
            id: item.id,
            username: item.username,
            profileImg: item.profileImg
          }
        })
      }
    )
  }


  onSendReq(index: number) {
    this.users[index].isReq = true;
  
    // Send only the current user's data (not the whole currentUserBlock array)
    const currentUser = {
      username: this.currentUserBlock[0].username,
      profileImg: this.currentUserBlock[0].profileImg,
      email: this.currentUserBlock[0].email,
      id: this.currentUserBlock[0].id
    };
  
    this.userService.sendFriendReq(this.users[index].id, currentUser).subscribe(
      (res: any) => {
        console.log("Friend request sent", res);
      },
      (error) => {
        console.log('Error: ', error);
      }
    );
    console.log(this.users[index]);
  }
}
