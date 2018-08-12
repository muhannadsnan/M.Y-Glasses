import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    name = "";
    message = {type: "", text: ""};

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
    this.name = this.route.snapshot.params['name'];
    //this.LINSTEN_Params();
    this.route.params.subscribe(params => this.name = params['name']);
    this.LINSTEN_Data(); // when data message, show toastr alert according to messageType
    }

    onNav(toName){
    this.router.navigate(['Home', toName]);
    }

    LINSTEN_Data(){
        this.route.data.subscribe(data => { //console.log("data", data);
            this.message.text = data.message;
            this.message.type = data.messageType; //console.log("message", this.message);
        });
    }
}
