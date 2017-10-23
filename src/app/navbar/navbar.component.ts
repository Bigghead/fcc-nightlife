import { AuthService } from '../Services/Authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor( public auth: AuthService ) { }

  ngOnInit() {
  }

  googleLogin(){
    window.location.href = "/auth/google/callback";
  }

  logOut(){
    this.auth.user = undefined;
    window.location.href = "/logout'";    
  }

}
