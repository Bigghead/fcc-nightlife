import { AuthService } from './../Services/Authentication.service';
import { Router } from '@angular/router';
import { DataService } from './../Services/ServerData.service';
import { Component, OnInit } from '@angular/core';
import * as GMaps from 'gmaps';

@Component({
  selector: 'app-bars',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.css']
})
export class BarsComponent implements OnInit {

  constructor( private dataService: DataService, 
               private router: Router, 
               public auth: AuthService ) { }


  bars: any;
  yelpData: any;

  ngOnInit() {

    this.getBars();
  }


  getBars(){

    let cityName = localStorage.getItem('cityName');
    if( !cityName ) return this.router.navigate( ['/'] );

    this.dataService.fetchData( `/bars/${cityName}`)
        .subscribe( res => {
          this.yelpData = res['data'];
          this.bars = res['bars'];
          setTimeout( () => this.getMap(), 100 );
        } )
  }


  getMap(){
    const map = new GMaps( {
      el: '#gMap',
      lat: this.yelpData.region.center.latitude,
      lng: this.yelpData.region.center.longitude
    } );

    this.getMarkers( map );
  }


  getMarkers( map ){

    this.yelpData.businesses.forEach( bar => {
      map.addMarker( {
        lat: bar.location.coordinate.latitude,
        lng: bar.location.coordinate.longitude,
        title: bar.name,
        infoWindow: {
          content: `<p><strong>${bar.name}<strong></p>
                    <p>${bar.whosGoing.length} Going</p>`
        }
      } )
    } )
  }

}
