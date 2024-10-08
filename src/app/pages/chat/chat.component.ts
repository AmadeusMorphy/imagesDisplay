import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

interface Message {
  id: number;
  text: string;
  reactions: { [userId: string]: string }; // Stores each user's reaction to the message
}


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatBody') private chatBody!: ElementRef;
  
  messages: Array<{
    content: string;
    type: 'sent' | 'received';
    reactions: string[];
  }> = [];
  
  newMessage: string = '';

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        content: this.newMessage.trim(),
        type: 'sent',
        reactions: []
      });
      
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
    if (!message.reactions.includes(reaction)) {
      message.reactions.push(reaction);
    } else {
      // Optionally, remove the reaction if it's already added
      message.reactions = message.reactions.filter((r: string) => r !== reaction);
    }
  }

  scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }
  
}
