import { Component, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { UserService } from './pages/services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'reproject';

  display: boolean = false;

  lastScrollTop = 0;
  isHidden = false;

  items!: MenuItem[];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > this.lastScrollTop && currentScroll > 100) {

      this.isHidden = true;

    } else {

      this.isHidden = false;
      
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
  }
 
  
  ngOnInit(): void {
            this.items = [
              {
                label: 'Login',
                icon: 'pi pi-plus',
                routerLink: '/login'
              },
              {
                label: 'Signup',
                icon: 'pi pi-search',
                routerLink: '/register'
              },
              {
                label: 'Inbox',
                icon: 'pi pi-inbox',
                routerLink: '/inbox'
              },
              {
                label: 'Friends',
                icon: 'pi pi-users',
                routerLink: '/friends'
              },
              {
                label: 'Add a friend',
                icon: 'pi pi-user-plus',
                routerLink: '/addFriend'
              },
              {
                label: 'Friend Requests',
                icon: 'pi pi-address-book',
                routerLink: '/friendReq'
              },
              {
                label: 'Logout',
                icon: 'pi pi-power-off',
                command: () => this.onLogout()
              }
              
        ];
  }

  isLoggedIn: boolean = false
  userLoggedIn: boolean = false;
  userName: any;
  checkUserLoggedIn() {
    const userData = localStorage
    const user = localStorage.getItem('userId');
    const UserName = localStorage.getItem('username')
    this.userName = UserName
    console.log(localStorage)
    this.userLoggedIn = user !== null;
    console.log(this.userLoggedIn)
    if (user) {

      this.isLoggedIn = true
      this.userService.getCurrentUser(user).subscribe(
        (res: any) => {

          console.log("Manual Service Response: ", res)
        }
      )
      this.userLoggedIn == true;
      console.log("You are logged in as: ", user);
    } else {
      this.userLoggedIn == false;

      console.error("You're not logged in")
    }
  }
  onLogout() {
      this.isLoggedIn = false;
      localStorage.removeItem('userId'); // Remove user data
      this.userLoggedIn = false; // Update login status
      this.router.navigateByUrl('/login')
    }
  
  
}
