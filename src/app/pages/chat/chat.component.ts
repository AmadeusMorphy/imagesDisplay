import { Component, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @ViewChild('chatBody') private chatBody!: ElementRef;
  
  messages: Array<{
    content: string;
    type: 'sent' | 'received';
    reactions: string[];
  }> = [];
  
  newMessage: string = '';
  selectedReceiver: any = null;
  showFriendsList: boolean = false; 
  friendsList: any[] = []; // Friends list for starting a new chat
  currentUserId: any;
  inboxUsers: any[] = []; // Filtered users for the inbox (who have exchanged messages)

  currentUserInfo: any = null;

  constructor(
    private chatService: ChatService,
    private checkChanges: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    
    this.getCurrentUser();

  }


  // ngAfterViewChecked() {
  //   this.scrollToBottom();
  // }

  getCurrentUser() {
    this.currentUserId = localStorage.getItem('userId');
    this.chatService.getUserById(this.currentUserId).subscribe((res: any) => {
      this.currentUserInfo = res;
      this.getInboxUsers();
      this.getFriendsList(); 
    });
  }

  getInboxUsers() {
    this.chatService.getUsers().subscribe((allUsers: any[]) => {
      this.inboxUsers = allUsers.filter(user => {
        // Check if the user has exchanged messages with the current user
        console.log(allUsers)
        const userName = localStorage.getItem('username')
        return user.messages && user.messages.some((msg: any) =>
          ((msg.receiverId == this.currentUserId && user.username != userName) ||
          (msg.senderId == this.currentUserId && user.username != userName))
        );
      });
      console.log('Inbox users: ', this.inboxUsers);
    });
  }


  sendMessage() {
    if (this.newMessage.trim()) {
      
      const message = {
        senderId: this.currentUserId,
        receiverId: this.selectedReceiver.id,
        content: this.newMessage, // Message content
        timestamp: new Date().toISOString(),
      };
      this.selectedReceiver.messages.push(message);

      // Create a copy of the receiver's messages for backend update
      const updatedReceiverData = {
        ...this.selectedReceiver,
        messages: [...this.selectedReceiver.messages]
      };
    
      // Update the receiver's data in the backend
      this.chatService.updateUserMessages(this.selectedReceiver.id, updatedReceiverData).subscribe(
        (res) => {
          console.log('Message sent to receiver: ', res);
          
          // Also update the current user's messages
          const updatedCurrentUserData = {
            ...this.currentUserInfo,
            messages: [...this.currentUserInfo.messages, message]
          };
          
          this.chatService.updateUserMessages(this.currentUserId, updatedCurrentUserData).subscribe(
            (res: any) => {
              console.log('Current user message updated: ', res);
              this.newMessage = ''; // Clear the text input after sending
              this.getFilteredMessages()
            }
          );
        },
        (error) => {
          console.error('Error updating user messages: ', error);
        }
      );

      // Simulate a reply (optional)
      setTimeout(() => {
        this.messages.push({
          content: 'This is a reply from the user.',
          type: 'received',
          reactions: []
        });
        this.scrollToBottom();
      }, 1000);
      
      this.newMessage = ''; // Clear the input field
    }
  }

  addReaction(message: any, reaction: string) {
    // Check if the reaction already exists
    if (!message.reactions.includes(reaction)) {
      message.reactions.push(reaction);
    }
  }

  startNewChat(friend: any) {
    this.selectUser(friend); // Set the selected user to the friend
    this.showFriendsList = false; // Close the friends list after selecting a user
  }

  getFriendsList() {
    // Assuming the friends are stored in the currentUserInfo object
    this.friendsList = this.currentUserInfo.friends  || []; // Access the friends property
    console.log('Friends list: ', this.friendsList);
  }

  selectUser(user: any) {
    this.selectedReceiver = user;

    // Ensure the selected user has messages or initialize an empty array
    if (!Array.isArray(this.selectedReceiver.messages)) {
      this.selectedReceiver.messages = [];
    }
  }

  scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }

  
  getFilteredReceiver() {
    return this.selectedReceiver.messages.filter((msg: any) =>
      (msg.senderId === this.currentUserId) ||
    ( msg.receiverId === this.currentUserId),
  );
}
getFilteredMessages() {
  const selectedReceiverMessages = this.selectedReceiver.messages.filter((msg: any) =>
    (msg.senderId === this.currentUserId) ||
    (msg.receiverId === this.currentUserId)
  );

  const currentUserMessages = this.currentUserInfo.messages.filter((msg: any) =>
    (msg.senderId === this.selectedReceiver.id)
  );

  return selectedReceiverMessages.concat(currentUserMessages);
}

}
