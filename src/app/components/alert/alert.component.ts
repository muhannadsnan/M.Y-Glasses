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
            setTimeout(() =>{
                if(this.message)
                    this.message.hide = true;
                setTimeout(() =>{
                    if(this.message)
                        this.message.text = ''; 
                }, 6000)                    
            }, 4000);            
        });
    }

    ngOnDestroy(){
        this.tmp.unsubscribe();
    }
}
