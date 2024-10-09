import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { debounceTime } from 'rxjs';
import { UserService } from '../services/user.service';


interface Reaction {
  emoji: string; // Store the emoji as a string
  userId: string; // Store the userId of the person who reacted
}

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
  inboxUsers: any[] = []; 
  friendsList: any[] = []; 
  selectedReceiver: any = null;
  currentUserId: any;
  currentUserInfo: any = null;
  showImageSelection: boolean = false;
  selectedImage: string | null = null;
  newMessage: string | null = null;
  isMobile: boolean = false;
  showFriendsList: boolean = false; 
  isSending: boolean = false;
  isSent: boolean = false;

  hoveredMessage: any = null; 
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
      localStorage.setItem('currentFriend', this.selectedReceiver.id)
      this.scrollToBottom();
    }
  }

  onSelectionChange(value: string) {
    if (value === 'favImgs') {
      this.showfavImgs();
      this.isFavVideos = false
    } else if(value === 'favVideos') {
      this.isFavImages = false; 
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
        behavior: 'smooth' 
      });
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }


  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768; 
  }

  backToInbox() {
    this.selectedReceiver = null; 
  }


  getCurrentUser() {
    this.isLoading = true;
    this.currentUserId = localStorage.getItem('userId');
    this.chatService.getUserById(this.currentUserId).subscribe((res: any) => {
      this.currentUserInfo = res;
      this.getInboxUsers();
      this.getFriendsList();
      this.isLoading = false
    });
  }


  getInboxUsers() {
    this.chatService.getUsers().pipe(debounceTime(300)).subscribe((allUsers: any[]) => {
      this.inboxUsers = allUsers.filter(user => {

        const userName = localStorage.getItem('username')
        return user.messages && user.messages.some((msg: any) =>
        ((msg.receiverId == this.currentUserId && user.username != userName) ||
          (msg.senderId == this.currentUserId && user.username != userName))
        );
      });
    });
  }


  getFriendsList() {
    this.friendsList = this.currentUserInfo.friends || [];
    console.log('Friends list: ', this.friendsList);
  }


  selectUser(user: any) {
    this.selectedReceiver = user;
    if (!Array.isArray(this.selectedReceiver.messages)) {
      this.selectedReceiver.messages = [];
    }
    this.getInboxUsers()
  }


  startNewChat(friend: any) {
    this.selectUser(friend); 
    this.showFriendsList = false;
    this.getInboxUsers()

  }

  openImageSelection() {
    this.showImageSelection = true;
  }

 
  closeImageSelection() {
    this.showImageSelection = false;
  }

 
  selectImage(image: string) {
    this.selectedImage = image;
    this.showImageSelection = false; 
  }

 
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
        content: this.newMessage, 
        timestamp: new Date().toISOString(),
        image: this.selectedImage, 
        isSending: true,
        isSent: true,
        reactions: []
      };
      
      this.newMessage = null; 

  
      this.selectedReceiver.messages.push(message);


      const updatedReceiverData = {
        ...this.selectedReceiver,
        messages: [...this.selectedReceiver.messages, message]
      };
  
      this.chatService.updateUserMessages(this.selectedReceiver.id, updatedReceiverData).subscribe(
        (res) => {
          console.log('Message sent to receiver: ', res);
  
   
          message.isSending = true; 
          message.isSent = true; 
  
          const updatedCurrentUserData = {
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
    this.getInboxUsers()

  }

  addReaction(message: any, emoji: string) {
    // Find existing reaction from current user
    const existingReaction = message.reactions.find((reaction: Reaction) => reaction.userId === this.currentUserId);
  
    if (existingReaction) {
      // Update the reaction emoji if it's different
      if (existingReaction.emoji !== emoji) {
        existingReaction.emoji = emoji;
      } else {
        // Remove the reaction if they click the same emoji again
        message.reactions = message.reactions.filter((reaction: Reaction) => reaction.userId !== this.currentUserId);
      }
    } else {
      // Add a new reaction
      message.reactions.push({ emoji, userId: this.currentUserId });
    }
  
    // Update the message in the backend
    this.updateMessageInDatabase(message);
  }
  
  updateMessageInDatabase(message: any) {
    const updatedReceiverData = {
      ...this.selectedReceiver,
      messages: [...this.selectedReceiver.messages]
    };
  
    this.chatService.updateUserMessages(this.selectedReceiver.id, updatedReceiverData).subscribe(
      (res) => {
        console.log('Updated message with reactions:', res);
      },
      (error) => {
        console.error('Error updating message reactions: ', error);
      }
    );
  }
  

 getFilteredMessages() {
    return this.selectedReceiver.messages.filter((msg: any) =>
      (msg.senderId === this.currentUserId && msg.receiverId === this.selectedReceiver.id) ||
      (msg.senderId === this.selectedReceiver.id && msg.receiverId === this.currentUserId)
    );
  }
}
