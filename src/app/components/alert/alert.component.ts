import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscribable, Subscription } from 'rxjs';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
    message = null;
    tmp: Subscription;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.tmp = this.alertService.getMessage().subscribe(message => { 
            this.message = message; 
            setInterval(() =>{
                if(this.message)
                    this.message.hide = true;                    
            }, 4000)
        });
    }

    ngOnDestroy(){
        this.tmp.unsubscribe();
    }
}
