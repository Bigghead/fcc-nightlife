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


    fetchData( url ){
        return this.http.get( this.url + url )
                   .map( res => res.json() )
    }
}