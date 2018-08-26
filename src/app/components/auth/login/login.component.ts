import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    user = {};
    isLoading: boolean = false;

    constructor(private route: ActivatedRoute,
                    private router: Router,
                    private authService: AuthService) {}

    ngOnInit() {
        this.LISTEN_Params();
    }

    LISTEN_Params(){
    }

    onLogin(){
        let navTo = '';
        if(this.authService.authenticate()){
            this.route.queryParams.subscribe(params => {
                if(params.returnTo)
                    navTo = params.returnTo;
                else
                    navTo = 'home';
                this.router.navigate([navTo]);
            });
            // toastr message
        }
    }

    ngOnDestroy(){
    }
}
