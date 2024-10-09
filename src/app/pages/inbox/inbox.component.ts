import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { debounceTime } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  @ViewChild('chatBody') private chatBody!: ElementRef;


  stateOptions: any[] = [
    { 
      label: 'Fav Images', 
      value: 'favImgs'
    },
    { 
      label: 'Fav Videos', 
      value: 'favVideos'
    }
  ];

  value: string = 'favImgs';
  isFavImages: boolean = true;
  isFavVideos: boolean = false;
  users: any[] = [];
  isLoading: boolean = false;
  inboxUsers: any[] = []; // Filtered users for the inbox (who have exchanged messages)
  friendsList: any[] = []; // Friends list for starting a new chat
  selectedReceiver: any = null;
  currentUserId: any;
  currentUserInfo: any = null;
  showImageSelection: boolean = false; // To toggle the image selection modal
  selectedImage: string | null = null;
  newMessage: string | null = null;
  isMobile: boolean = false;
  showFriendsList: boolean = false; 
  isSending: boolean = false;
  isSent: boolean = false;
  image: {
    urls: string
  }[] = [];

  constructor(
    private chatService: ChatService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.checkIfMobile();
    this.getImgs()
    window.addEventListener('resize', this.checkIfMobile.bind(this));
  }
  ngAfterViewChecked() {
    if (this.selectedReceiver) {
      console.log('his data: ',this.selectedReceiver)
      localStorage.setItem('currentFriend', this.selectedReceiver.id)
      console.log('current friend: ', localStorage.getItem('currentFriend'))
      this.scrollToBottom();
    }
  }

  onSelectionChange(value: string) {
    if (value === 'favImgs') {
      this.showfavImgs();
      this.isFavVideos = false
    } else if(value === 'favVideos') {
      this.isFavImages = false; // Reset if another option is selected
      this.isFavVideos = true
    }
  }

  getImgs(){
    this.userService.getImages().subscribe(
      (res: any) => {
        this.image = res.map((item: any) => {
          return {
            urls: item.urls.full
          }
        })
      }
    )
  }
  
  showfavImgs() {
    this.isFavImages = true;
  }

  scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTo({
        top: this.chatBody.nativeElement.scrollHeight,
        behavior: 'smooth' // Add smooth scrolling behavior
      });
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }


  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768; // Set to true if the screen width is less than or equal to 768px
  }

  backToInbox() {
    this.selectedReceiver = null; // Reset selected user
  }

  // Get the current logged-in user info and their messages
  getCurrentUser() {
    this.isLoading = true;
    this.currentUserId = localStorage.getItem('userId');
    this.chatService.getUserById(this.currentUserId).subscribe((res: any) => {
      this.currentUserInfo = res;
      this.getInboxUsers();
      this.getFriendsList(); // Get the friends list
      this.isLoading = false
    });
  }

  // Filter users who have exchanged messages with the current user
  getInboxUsers() {
    this.chatService.getUsers().pipe(debounceTime(300)).subscribe((allUsers: any[]) => {
      this.inboxUsers = allUsers.filter(user => {
        // Check if the user has exchanged messages with the current user
        console.log(allUsers)
        const userName = localStorage.getItem('username')
        return user.messages && user.messages.some((msg: any) =>
        ((msg.receiverId == this.currentUserId && user.username != userName) ||
          (msg.senderId == this.currentUserId && user.username != userName))
        );
      });
      console.log('Inbox users: ', this.inboxUsers[0]);
    });
  }

  // Get the friends list from the current user info
  getFriendsList() {
    // Assuming the friends are stored in the currentUserInfo object
    this.friendsList = this.currentUserInfo.friends || []; // Access the friends property
    console.log('Friends list: ', this.friendsList);
  }

  // Select the receiver to chat with and display messages
  selectUser(user: any) {
    this.selectedReceiver = user;

    // Ensure the selected user has messages or initialize an empty array
    if (!Array.isArray(this.selectedReceiver.messages)) {
      this.selectedReceiver.messages = [];
    }
  }

  // Method to start a new chat with a selected friend
  startNewChat(friend: any) {
    this.selectUser(friend); // Set the selected user to the friend
    this.showFriendsList = false; // Close the friends list after selecting a user
  }

  openImageSelection() {
    this.showImageSelection = true;
  }

  // Close the image selection modal
  closeImageSelection() {
    this.showImageSelection = false;
  }

  // Handle image selection
  selectImage(image: string) {
    this.selectedImage = image;
    this.showImageSelection = false; // Close the modal after selection
  }

  // Send a message to the selected receiver
  sendMessage() {
    if (!this.selectedReceiver) {
      console.error('No user selected to send message to');
      return;
    }
  
    if (!this.newMessage || this.newMessage.trim() === '') {
      console.log('You can\'t send nothing or only spaces');
      return;
    } else {
      const message = {
        senderId: this.currentUserId,
        receiverId: this.selectedReceiver.id,
        content: this.newMessage, // Message content
        timestamp: new Date().toISOString(),
        image: this.selectedImage, // Include the selected image (if any)
        isSending: true, // Set isSending to true when message is created
        isSent: true // Initially, message is not sent
      };
      
      this.newMessage = null; // Clear the text input after sending
  
      // Push the message to the receiver's messages array
      this.selectedReceiver.messages.push(message);
  
      // Simulate sending the message to the backend
      const updatedReceiverData = {
        ...this.selectedReceiver,
        messages: [...this.selectedReceiver.messages]
      };
  
      this.chatService.updateUserMessages(this.selectedReceiver.id, updatedReceiverData).subscribe(
        (res) => {
          console.log('Message sent to receiver: ', res);
  
          // Mark the message as sent
          message.isSending = true; // Sending is done
          message.isSent = true; // Message has been successfully sent
  
          // Also update the current user's messages
          const updatedCurrentUserData = {
            ...this.currentUserInfo,
            messages: [...this.currentUserInfo.messages, message]
          };
  
          this.chatService.updateUserMessages(this.currentUserId, updatedCurrentUserData).subscribe(
            (res: any) => {
              console.log('Current user message updated: ', res);
              this.selectedImage = null;
              this.isSent = true
            }
          );
        },
        (error) => {
          console.error('Error updating user messages: ', error);
        }
      );
    }
  }
  

  // Filter messages to display only between current user and the selected receiver
  getFilteredMessages() {
    return this.selectedReceiver.messages.filter((msg: any) =>
      (msg.senderId === this.currentUserId && msg.receiverId === this.selectedReceiver.id) ||
      (msg.senderId === this.selectedReceiver.id && msg.receiverId === this.currentUserId)
    );
  }
}
