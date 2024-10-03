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
import { ImageModule} from 'primeng/image'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

  ],
  imports: [
    AvatarModule, AppRoutingModule, BadgeModule,
    BrowserModule, ButtonModule, BrowserAnimationsModule, 
    HttpClientModule, MenubarModule, InputTextModule, 
    RippleModule, RouterOutlet,SidebarModule,  
    PanelMenuModule, MenuModule, ImageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
