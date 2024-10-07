import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})


  export class InboxComponent implements OnInit {
    users: any[] = [];
  inboxUsers: any[] = []; // Filtered users for the inbox (who have exchanged messages)
  selectedReceiver: any = null;
  currentUserId: any;
  currentUserInfo: any = null;
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  // Get the current logged-in user info and their messages
  getCurrentUser() {
    this.currentUserId = localStorage.getItem('userId');
    this.chatService.getUserById(this.currentUserId).subscribe((res: any) => {
      this.currentUserInfo = res;
      this.getInboxUsers();
    });
  }

  // Filter users who have exchanged messages with the current user
  getInboxUsers() {
    this.chatService.getUsers().subscribe((allUsers: any[]) => {
      this.inboxUsers = allUsers.filter(user => {
        // Check if the user has exchanged messages with the current user
        return user.messages && user.messages.some((msg: any) =>
          ((msg.receiverId == this.currentUserId && user.id != this.currentUserId) ||
          (msg.senderId == this.currentUserId && user.id != this.currentUserId))
        );
      });
      console.log('Inbox users: ', this.inboxUsers);
    });
  }

  // Select the receiver to chat with and display messages
  selectUser(user: any) {
    this.selectedReceiver = user;

    // Ensure the selected user has messages or initialize an empty array
    if (!Array.isArray(this.selectedReceiver.messages)) {
      this.selectedReceiver.messages = [];
    }
  }

  // Send a message to the selected receiver
  sendMessage() {
    if (!this.selectedReceiver) {
      console.error('No user selected to send message to');
      return;
    }

    const message = {
      senderId: this.currentUserId,
      receiverId: this.selectedReceiver.id,
      content: this.newMessage,
      timestamp: new Date().toISOString(),
    };

    // Push the message to the receiver's messages array
    this.selectedReceiver.messages.push(message);

    // Create a copy of the receiver's messages for the backend update
    const updatedReceiverData = {
      ...this.selectedReceiver,
      messages: [...this.selectedReceiver.messages] // Ensure you are only updating messages
    };

    // Update the receiver's data in the backend
    this.chatService.updateUserMessages(this.selectedReceiver.id, updatedReceiverData).subscribe(
      (res) => {
        console.log('Message sent to receiver: ', res);
        // Also update the current user's messages
        const updatedCurrentUserData = {
          ...this.currentUserInfo,
          messages: [...this.currentUserInfo.messages, message] // Update current user's messages
        };

        this.chatService.updateUserMessages(this.currentUserId, updatedCurrentUserData).subscribe(
          (res: any) => {
            console.log('Current user message updated: ', res);
            this.newMessage = ''; // Clear the input after sending
          }
        );
      },
      (error) => {
        console.error('Error updating user messages: ', error);
      }
    );
  }

  // Filter messages to display only between current user and the selected receiver
  getFilteredMessages() {
    return this.selectedReceiver.messages.filter((msg: any) =>
      (msg.senderId === this.currentUserId && msg.receiverId === this.selectedReceiver.id) ||
      (msg.senderId === this.selectedReceiver.id && msg.receiverId === this.currentUserId)
    );
  }
}
