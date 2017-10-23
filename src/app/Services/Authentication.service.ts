import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class AuthService {


    user = undefined; 
    userUpdate = new Subject<any>();

    isLoggedIn(){
        return this.user !== undefined;
    }
}