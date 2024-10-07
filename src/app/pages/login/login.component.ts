import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
    
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    
    this.testing()

    const user = localStorage
    console.log(user)
  }

  testing() {
    this.userService.getUser().subscribe(
      (res: any) => {
        console.log('new api: ', res)
      }
    )
  }


  onLogin() {
    const {email, password} = this.loginForm.value;

    this.userService.onLogin(email, password).subscribe(
      (res: any) => {
        console.log('Successfully logged in: ', res)
        localStorage.setItem('username', res[0].username)
        localStorage.setItem('userId', res[0].id)
        console.log(localStorage)
        this.router.navigateByUrl('/inbox')
      }, (error) => {
        console.log("error stuff: ", error)
      }
    )
  }

}
