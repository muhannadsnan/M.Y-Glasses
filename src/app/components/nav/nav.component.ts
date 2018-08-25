import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  loggedin = false;

  constructor(private authService: AuthService,
                    private router: Router,
                    private route: ActivatedRoute) { }

  ngOnInit() {
    this.loggedin = this.authService.isLoggedIn;
  }
  
  onLogin(){
    this.authService.authenticate();
    this.loggedin = true;
    this.route.queryParams.subscribe(params => this.router.navigate([params.returnTo]));
  }
  
  onLogout(){
    this.authService.logout();
    this.loggedin = false;
    this.router.navigate(['home']);
  }

}
