import { Component, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
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
            routerLink: '/register' }
        ];
  }
}
