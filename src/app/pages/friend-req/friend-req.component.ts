import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-friend-req',
  templateUrl: './friend-req.component.html',
  styleUrls: ['./friend-req.component.scss']
})
export class FriendReqComponent {

  constructor(
    private userService: UserService
  ) {}

  currentUserId: any
  friendReqs: {
    username: string,
    profileImg: string,
    email: string,
    id: string,
    isAccept: boolean
  }[] =[]

  selectedUser!: string;
  isAccept: boolean = false;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  
    this.getReqs()
  }

  getReqs() {
    this.currentUserId = localStorage.getItem('userId')

    this.userService.getCurrentUser(this.currentUserId).subscribe(
      (res: any) => {
        console.log('current user: ', res)

        this.friendReqs = res.friendRequests?.map((item: any) => {
          return {
            username: item.username,
            profileImg: item.profileImg[0],
            email: item.email,
            id: item.id
          }
        })
        console.log(this.friendReqs)
      }
    )
  }

  onAccept(index: number) {
    this.friendReqs[index].isAccept = true;
    this.selectedUser = this.friendReqs[index].id;
  
    this.userService.acceptFriendReq(this.currentUserId, this.friendReqs[index]).subscribe(
      (res: any) => {
        console.log('Friend request accepted: ', res);
        
        // After accepting, remove the friend request from `friendRequests`
        this.userService.removeFriendReq(this.currentUserId, this.selectedUser).subscribe(
          (res: any) => {
            console.log("User removed from requests: ", res);
  
            // Optionally, remove the request from the local `friendReqs` array
   // Remove the accepted request from the UI
          }
        );
      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }

  onSendReq(index: number) {

    this.friendReqs[index].isAccept = true
    console.log(this.friendReqs[index])
  }



}
