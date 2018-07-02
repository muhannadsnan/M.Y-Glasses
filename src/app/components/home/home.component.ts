import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  name = "";

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.name = this.route.snapshot.params['name'];
    this.route.params.subscribe(params => this.name = params['name']);
  }

  onNav(toName){
    this.router.navigate(['Home', toName]);
  }

}
