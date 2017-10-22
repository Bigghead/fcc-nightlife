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
               private dataService: DataService ) { }

  searchForm: FormGroup;


  ngOnInit() {

    this.initForm();
  }


  initForm(){

    this.searchForm = new FormGroup( {
      city: new FormControl( )
    } )
  }

  
  submitForm(){
    
    this.dataService.cityName = this.searchForm.value.city;
    this.router.navigate( ['/bars'] );
  }

}
