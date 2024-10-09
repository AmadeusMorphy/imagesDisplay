import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FriendsComponent } from './pages/friends/friends.component';
import { FriendReqComponent } from './pages/friend-req/friend-req.component';
import { AddFriendComponent } from './pages/add-friend/add-friend.component';
import { InboxComponent } from './pages/inbox/inbox.component';
import { ChatComponent } from './pages/chat/chat.component';
import { UsersProfileComponent } from './pages/users-profile/users-profile.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'friends', component: FriendsComponent},
  {path: 'friendReq', component: FriendReqComponent},
  {path: 'addFriend', component: AddFriendComponent},
  {path: 'inbox', component: InboxComponent},
  {path: 'chat', component: ChatComponent},
  {path: 'users-profile', component: UsersProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
