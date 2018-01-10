import { AuthService } from '../Services/Authentication.service';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../Services/ServerData.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor( public auth: AuthService, private dataService: DataService ) { }

  user: boolean = false;;

  ngOnInit() {

    this.dataService.fetchData( '/user' )
        .subscribe( res => {
            this.user = true;
            this.auth.user = res;
            this.auth.userUpdate.next( true );
        }, err => this.user = false )

  }

  googleLogin(){
    window.location.href = "/auth/google/callback";
  }

  logOut(){
    this.user = undefined;
    this.auth.user = undefined;
    localStorage.clear();
    window.location.href = "/bars/user/logout";    
  }

}
