import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
    isLoggedIn = false;
    tmp: Subscription[] = [];

    constructor(private authService: AuthService,
                    private router: Router,
                    private route: ActivatedRoute) { }

    ngOnInit() {
        this.LISTEN_loginState();
        this.isLoggedIn = this.authService.isLoggedIn;
    }

    LISTEN_loginState(){
        this.tmp[0] = this.authService.loginState.subscribe(state => this.isLoggedIn = state);
    }

    onLogout(){
        this.authService.logout();
        this.isLoggedIn = false;
        this.router.navigate(['home']);
    }

    ngOnDestroy(){

    }
}
