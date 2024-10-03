import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{

  constructor(private http: HttpClient) {}

  image: {
    urls: string
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
            urls: item.urls.full
          }
        })
        console.log(this.image)
      }
    )

  }

}
