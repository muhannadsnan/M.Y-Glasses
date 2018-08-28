import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Client } from '../../../models/client';
import { ClientService } from '../../../services/client.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit, OnDestroy {
    @Input() client: Client; 
    adminMode;
    isLoading: boolean;
    tmp: Subscription[] = [];

    constructor(private clientService: ClientService,
                    private categoryService: CategoryService,
                    private modalService: ModalService,
                    private route: ActivatedRoute) { }

    ngOnInit() {
        this.LOADING(false);
        this.LISTEN_AdminMode();
        this.InitClient();
    }

    InitClient(){
        if( ! this.client ){ //console.log("this.client has been initialized!");
            this.client = new Client
            this.adminMode = "add-mode"
        }else this.adminMode = "edit-mode"
    }

    INIT_Data(){
        this.tmp[4] = this.route.data.subscribe(data => {
            if(data.adminMode)
                this.clientService.adminMode.next(data.adminMode);
        } ); 
    }

    LISTEN_AdminMode(){
        this.tmp[0] = this.clientService.adminMode.subscribe(mode => { console.log(mode);
            this.adminMode = mode;
            if(mode == 'add-mode') // to reset after edit-mode
                this.client = new Client();
        });
    }

    onCreateClient(){
        this.LOADING(true);
        this.tmp[2] = this.clientService.createClient(this.client).subscribe(resp => {
            this.modalService.showModal.next(false);
            //toastr msg
            this.LOADING(false);
            this.clientService.loadingClients.next(false);
            console.log("resp create client", resp);
            this.client.id = resp;
            this.clientService.clientCreated.next(this.client);
            this.client = new Client;
        });
    }

    switchAdminMode(mode){        
        this.clientService.adminMode.next(mode); console.log(this.adminMode);
    }

    saveChanges(){
        this.LOADING(true);
        this.tmp[2] = this.clientService.updateClient(this.client).subscribe(resp => { console.log(resp);
            this.LOADING(false);
            this.clientService.adminMode.next('detail-mode');
        });
    }

    LOADING(value){
        this.isLoading = value;
        this.modalService.isLoading.next(value);
    }

    ngOnDestroy(){
        this.tmp.forEach( subs => subs.unsubscribe() );
    }

}
