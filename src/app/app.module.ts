import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import {SidebarModule} from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {PanelMenuModule} from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ImageModule} from 'primeng/image';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component'
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FriendReqComponent } from './pages/friend-req/friend-req.component';
import { FriendsComponent } from './pages/friends/friends.component';
import { AddFriendComponent } from './pages/add-friend/add-friend.component';
import { InboxComponent } from './pages/inbox/inbox.component';
import { FieldsetModule } from 'primeng/fieldset';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ChatComponent } from './pages/chat/chat.component';
import { ChangeDetectorRef } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { UsersProfileComponent } from './pages/users-profile/users-profile.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    FriendReqComponent,
    FriendsComponent,
    AddFriendComponent,
    InboxComponent,
    ChatComponent,
    UsersProfileComponent,

  ],
  imports: [
    AvatarModule, AppRoutingModule, BadgeModule,
    BrowserModule, ButtonModule, BrowserAnimationsModule, 
    HttpClientModule, MenubarModule, InputTextModule, 
    RippleModule, RouterOutlet,SidebarModule,  
    PanelMenuModule, MenuModule, ImageModule,
    FormsModule, ReactiveFormsModule, FieldsetModule,
    ScrollPanelModule, ProgressSpinnerModule, DialogModule,
    SelectButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
