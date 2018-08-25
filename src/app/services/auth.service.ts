import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {
    isLoggedIn: boolean = false;
    user: {} = {};

    authenticate(){
        this.isLoggedIn = true;
    }

    logout(){
        this.isLoggedIn = false;
    }
}