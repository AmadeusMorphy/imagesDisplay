import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users-profile',
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.scss']
})
export class UsersProfileComponent {
  isLoading: boolean = false;
  friendId: any;
  friendInfo: any = {}; // Initialize as an object to hold the friend details

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getFriend();
  }

  getFriend() {
    this.isLoading = true;
    this.friendId = localStorage.getItem('currentFriend');

    this.userService.getCurrentUser(this.friendId).subscribe(
      (res: any) => {
        console.log('Current friend info: ', res);
        // Assign the response data to friendInfo
        this.friendInfo = {
          username: res.username,
          email: res.email,
          profileImg: res.profileImg,
          friends: res.friends,
          DateJoined: res.DateJoined
        };
        this.isLoading = false;
        console.log('Logging friend info:', this.friendInfo);
      },
      (error: any) => {
        console.error('Error fetching friend data:', error);
        this.isLoading = false; // Stop loading even if there was an error
      }
    );
  }
}
