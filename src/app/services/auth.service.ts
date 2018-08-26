import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class AuthService {
    isLoggedIn: boolean = false;
    loginState: Subject<any> = new Subject<any>();
    user: {} = {};

    authenticate(){
        this.isLoggedIn = true;
        this.loginState.next(true);
        return true;
    }

    logout(){
        this.isLoggedIn = false;
        this.loginState.next(false);
    }
}