import { Http } from '@angular/http';
import { AuthService } from './../Services/Authentication.service';
import { DataService } from '../Services/ServerData.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor( private router: Router, 
               private dataService: DataService,
               private auth: AuthService,
               private http: Http ) { }

  searchForm: FormGroup;


  ngOnInit() {
    
    this.checkUser();
    this.initForm();
  }


   checkUser(){

    this.http.get( '/user' )
        .subscribe( res => {
          let data = JSON.parse( res['_body'])
          if( Object.keys(data).length ) {
            this.auth.user = data
          }

          this.isLoggedIn();
        } )
  }


  isLoggedIn(){
    
    if( this.auth.isLoggedIn() ){
      this.router.navigate( ['/bars'] );
    }
  }


  initForm(){

    this.searchForm = new FormGroup( {
      city: new FormControl( )
    } )
  }

  
  submitForm(){
    
    this.dataService.cityName = this.searchForm.value.city;
    localStorage.setItem('cityName', this.searchForm.value.city)
    this.router.navigate( ['/bars'] );
  }

}
