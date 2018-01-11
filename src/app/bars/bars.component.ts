import { AuthService } from './../Services/Authentication.service';
import { Router } from '@angular/router';
import { DataService } from './../Services/ServerData.service';
import { Component, OnInit } from '@angular/core';
import * as GMaps from 'gmaps';
import 'rxjs/add/operator/do';

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
  user = this.auth.isLoggedIn();
  map;

  ngOnInit() {

    this.getBars();
    this.auth.userUpdate
        .subscribe( res => this.user = res )
  }


  getBars(){

    let cityName = localStorage.getItem('cityName');
    if( !cityName ) return this.router.navigate( ['/'] );

    this.dataService.fetch( 'get', `/bars/${cityName}`)
        .do( res => {
          if( this.auth.user ){
            res['data'].businesses.forEach( bar => {
              return bar['isGoing'] = bar.whosGoing.includes( this.auth.user._id)
            } ) 
          }
        } )
        .subscribe( res => {
          this.yelpData = res['data'];
          this.bars = res['bars'];
          setTimeout( () => this.getMap(), 100 );
        } )
  }


  getMap(){
    this.map = new GMaps( {
      el: '#gMap',
      lat: this.yelpData.region.center.latitude,
      lng: this.yelpData.region.center.longitude
    } );

    this.getMarkers( this.map );
  }


  getMarkers( map ){

    this.yelpData.businesses.forEach( bar => {
        this.setMarker( map, bar );
    } )
  }


  setMarker( map, bar ){
    map.addMarker( {
      lat: bar.location.coordinate.latitude,
      lng: bar.location.coordinate.longitude,
      title: bar.name,
      infoWindow: {
        content: `<p><strong>${bar.name}<strong></p>
                  <p>${bar.whosGoing.length} Going</p>`
      }
    } )
  } 


  addUser( index, barId ) {
    return this.dataService
               .fetch( 'post', '/bars/' + barId  )
               .subscribe( 
                 res => {
                    this.yelpData.businesses[index].whosGoing.push( this.auth.user._id );
                    this.map.addMarker( this.map, this.yelpData.businesses[index])
                    
                 }
               )
  }


  deleteUser( index, barId ){
    return this.dataService.deleteUser( barId )
               .subscribe( res => {
                 this.yelpData.businesses.splice( index, 1 );
                 this.map.addMarker( this.map, this.yelpData.businesses[index])
               })
  }

}
