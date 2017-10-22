import { Injectable } from '@angular/core';

@Injectable()

export class AuthService {

    user = undefined; 

    isLoggedIn(){
        return this.user !== undefined;
    }
}