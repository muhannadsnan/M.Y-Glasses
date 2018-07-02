import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  loggedin = false;

  constructor(private categoryservice: CategoryService, private router: Router) { }

  ngOnInit() {
    this.loggedin = this.categoryservice.isLoggedin;
  }
  
  onLogin(){
    this.categoryservice.isLoggedin = true;
    this.loggedin = true;
    this.router.navigate(['categories']);
  }
  
  onLogout(){
    this.categoryservice.isLoggedin = false;
    this.loggedin = false;
    this.router.navigate(['home']);
  }

}
