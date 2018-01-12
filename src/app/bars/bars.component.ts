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
  labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
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
          setTimeout( () => this.getMap( ), 100 );
        } )
  }


  getMap( ){
    const map = new GMaps( {
      el: '#gMap',
      lat: this.yelpData.region.center.latitude,
      lng: this.yelpData.region.center.longitude
    } );
    this.getMarkers( map );
  }


  getMarkers( map ){

    this.yelpData.businesses.forEach( ( bar, index ) => {
        this.setMarker( map, bar, index );
    } )
  }


  setMarker( map, bar, index ){
    map.addMarker( {
      lat: bar.location.coordinate.latitude,
      lng: bar.location.coordinate.longitude,
      title: bar.name,
      label: this.labels[index],
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
                    this.yelpData.businesses[index].isGoing = true;                    
                    this.getMap( );
                    
                 }
               )
  }


  deleteUser( index, barId ){
    return this.dataService.deleteUser( barId )
               .subscribe( res => {
                   let userId = this.auth.user._id;
                   let currentBar = this.yelpData.businesses[index];
                   currentBar.whosGoing.splice( currentBar.whosGoing.indexOf( userId ), 1 );
                   currentBar.isGoing = false;
                   this.getMap( );
                } )
  }

}
