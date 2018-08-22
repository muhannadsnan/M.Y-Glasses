import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Client } from '../../../models/client';
import { ClientService } from '../../../services/client.service';
import { ModalService } from '../../../services/modal.service';
import { Subscription } from '../../../../../node_modules/rxjs';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit, OnDestroy {
    @Input() client: Client;
    @Input() showAs: string;
    adminMode: string; // add, edit in modal
    isLoading: boolean = false;
    tmp: Subscription[] = [];

    constructor(private clientService: ClientService,
                    private modalService: ModalService,
                    private route: ActivatedRoute,
                    private router: Router) { }

    ngOnInit() { // order is important here        
        this.LISTEN_AdminMode();
        this.INIT_Data();
        this.LISTEN_Params();
        this.tmp[1] = this.clientService.selectedClient.subscribe(client => this.client = client);
        if(typeof this.client == 'undefined' && this.showAs != 'table') {// means we will request the client
            this.LOADING(true);
        }
        if( !this.showAs)
            this.showAs = 'list-group-client';
    }

    LISTEN_AdminMode(){
        this.tmp[0] = this.clientService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add-mode')
                this.client = new Client();
        });
    }

    INIT_Data(){
        this.tmp[4] = this.route.data.subscribe(data => {
            this.showAs = data.showAs;
            if(data.adminMode)
                this.clientService.adminMode.next(data.adminMode);
        } ); 
    }

    LISTEN_Params(){
        this.tmp[5] = this.route.params.subscribe(params => { //console.log("params", params);
            if(this.showAs == "details" && (this.adminMode == "edit-mode" || this.adminMode == "detail-mode")){ // so dont request in /admin/clients when showAs table
                this.tmp[6] = this.clientService.getClientById(params.id).subscribe(client =>{ console.log("client", client)
                    if(typeof client == "undefined" || client === null){
                        alert("The object you are trying to reach is not available!");
                    }else{
                        this.client = client;
                        this.client.id = params.id;
                        this.LOADING(false);
                    }
                });
            }
        });
    }

    onClickClient(){
        this.clientService.selectedClient.next(this.client);
    }

    switchAdminMode(mode){        
        this.clientService.adminMode.next(mode); console.log(this.adminMode);
    }

    navigateByAdminMode(mode){
        let navigateUrl = [];
        if(mode == "edit-mode")
            navigateUrl = ['admin', 'clients', this.client.id, 'edit'];
        else if(mode == "detail-mode")
            navigateUrl = ['admin', 'clients', this.client.id];
        this.router.navigate(navigateUrl);
    }

    navTo(url){
        this.router.navigateByUrl(url);
    }
    
    deleteClient(){
        if(confirm(`Delete client "${this.client.name}"?`)){
            this.LOADING(true);
            this.clientService.loadingClients.next(true);
            this.tmp[3] = this.clientService.destroyClient(this.client.id).subscribe(resp => {
                console.log(resp);
                this.LOADING(false);
                this.modalService.showModal.next(false);
                this.clientService.loadingClients.next(false);
                this.clientService.clientDeleted.next(this.client);           
                this.client = new Client;
                this.router.navigateByUrl("/admin/clients");
            });
        }
    }

    LOADING(value){
        this.isLoading = value;
        this.modalService.isLoading.next(value);
    }

    ngOnDestroy(){
        this.tmp.forEach( el => el.unsubscribe() );
    }
}
