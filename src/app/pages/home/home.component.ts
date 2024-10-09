import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  currentUserId: any;
  image: {
    urls: string,
    alt_description: string
  }[] = [];

  ngOnInit(): void {
    
    this.imagesApi()
  }
  imagesApi() {

    const unsplashUrl = 'https://api.unsplash.com/photos/?client_id=i8e1hfdKCsN8sqrdHQJobjZ_ecsjg7po0QWv0gaxRCE'

    this.http.get(unsplashUrl).subscribe(
      (res: any) => {
        console.log(res)
        this.image = res.map((item: any) => {
          return {
            urls: item.urls.full,
            alt_description: item.alt_description
          }
        })
        console.log(this.image)
      }
    )
  }

  selectedId(index: any) {
    console.log(this.image[index])
  }

  addToHistory(index: any) {

    this.currentUserId = localStorage.getItem('userId');

    this.userService.addHistory(this.currentUserId, this.image[index]).subscribe(
      (res: any) => {
        console.log('added to history: ', res)
      }
    )
  }

}
