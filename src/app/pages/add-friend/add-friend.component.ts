import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { switchMap } from 'rxjs';

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

  currentUserInfo: any;

  ngOnInit(): void {
    
    
    this.getCurrentUserAndUsers()
  }

  
getCurrentUserAndUsers() {
  this.currentUserId = localStorage.getItem('userId');
  
  this.userService.getCurrentUser(this.currentUserId).pipe(
    switchMap((res: any) => {
      this.currentUserInfo = res;
      console.log('Your logged in as: ', res);
      this.currentUserBlock.push({
        username: res.username,
        profileImg: res.profileImg,
        email: res.email,
        id: res.id
      });
      return this.userService.getUser(); // Proceed to get users after current user info is fetched
    })
  ).subscribe(
    (res: any) => {
      console.log(res);
      const currentUserFriendsIds = this.currentUserInfo?.friends?.map((friend: any) => friend.id) || [];

      // Filter out users who are already friends
      this.users = res.filter((item: any) => !currentUserFriendsIds.includes(item.id)).map((item: any) => {
        return {
          id: item.id,
          username: item.username,
          profileImg: item.profileImg
        };
      });
      console.log('Filtered Users:', this.users);
    },
    (error) => {
      console.log('Error:', error);
    }
  );
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
