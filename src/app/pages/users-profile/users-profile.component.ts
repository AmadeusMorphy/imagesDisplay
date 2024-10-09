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
        // Convert the DateJoined timestamp to a readable date
        const dateJoined = new Date(res.DateJoined * 1000); // Multiply by 1000 to convert seconds to milliseconds
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          // minute: '2-digit',
          // second: '2-digit', // Optional: if you want to include timezone
        };
        const formattedDateJoined = dateJoined.toLocaleString('en-US', options); // Adjust the locale as needed
  
        // Assign the response data to friendInfo
        this.friendInfo = {
          username: res.username,
          email: res.email,
          profileImg: res.profileImg,
          friends: res.friends,
          images: res.images,
          playlist: res.playlist,
          history: res.history,
          DateJoined: formattedDateJoined // Use the formatted date
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
