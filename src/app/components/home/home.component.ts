import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    name = "";
    message = {type: "", text: ""};

    constructor(private route: ActivatedRoute, private router: Router, private alertService: AlertService) { }

    ngOnInit() {
    this.name = this.route.snapshot.params['name'];
    //this.LINSTEN_Params();
    this.route.params.subscribe(params => this.name = params['name']);
    this.LINSTEN_Params(); // when data message, show toastr alert according to messageType
    }

    onNav(toName){
    this.router.navigate(['Home', toName]);
    }

    LINSTEN_Params(){
        this.route.queryParams.subscribe(queryParams => { //console.log("params", params);
            if(queryParams.err){
                this.message.text = queryParams.err;
                this.message.type = "error"; //console.log("params.err", this.params.err);
                this.alertService.error(queryParams.err);
            }else if(queryParams.success){
                this.message.text = queryParams.success;
                this.message.type = "success"; //console.log("params.success", this.params.success);
                this.alertService.success(queryParams.success);
            }
        });
    }
}
