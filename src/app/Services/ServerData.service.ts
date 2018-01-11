import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import 'rxjs/add/operator/map';

@Injectable()

export class DataService {

    constructor( private http: Http ){}

    cityName: string = '';
    bars: any;
    yelpData: any;
    url: string = 'http://localhost:8000'


    fetch( method, url, body = {} ){

        let checkAction = method === 'get' 
                        ? this.http.get( url ).map( res => res.json() )
                        : this.http.post( url, body )
        return checkAction
                
    }


    deleteUser( url ){
        return this.http.delete( '/bars/' + url )
    }
}