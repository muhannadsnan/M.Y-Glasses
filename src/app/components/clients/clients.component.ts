import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})

export class ClientsComponent implements OnInit, OnDestroy {
    clients;
    selectedId = 0;
    loadingClients;
    showAs;
    adminMode;
    tmp: Subscription[] = [];

    constructor(private clientService: ClientService,
                private modalService: ModalService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() { //console.log("clientsss");
        this.LISTEN_LoadingClients();
        this.LISTEN_CreateClients();
        this.LISTEN_DeleteClients();
        this.getClients();
        this.showAs = 'grid';
        this.LISTEN_Data();
        this.LISTEN_AdminMode_clientService();
    }

    clientChanged(client) { //console.log("client clicked",client);
        this.selectedId = client.id;
        this.clientService.selectedClient.next(client);
    }

    getClients(){
        this.clientService.loadingClients.next(true);
        this.tmp[0] = this.clientService.readClients().subscribe(resp => { //console.log("resp", resp);
            if(typeof resp === "undefined"){
                this.clients = [];
            }else{
                this.clients = resp;
            }            
            this.clientService.loadingClients.next(false);
        });
    }

    LISTEN_LoadingClients(){
        this.tmp[1] = this.clientService.loadingClients.subscribe(isLoading => this.loadingClients = isLoading);
    }

    LISTEN_CreateClients(){
        this.tmp[2] = this.clientService.clientCreated.subscribe(createdClient => {
            this.clients.unshift(createdClient);
        });
    }
    
    LISTEN_DeleteClients(){
        this.tmp[3] = this.clientService.clientDeleted.subscribe(deletedClient => { 
            this.clients = this.clients.filter(client => client !== deletedClient);
        });
    }

    LISTEN_Data(){
        this.tmp[4] = this.route.data.subscribe(data => { //console.log("showAs", this.showAs);
            if(data.showAs){
                this.showAs = data.showAs; //console.log("data ", data);
            }
        });
    }

    LISTEN_AdminMode_clientService(){
        this.tmp[5] = this.clientService.adminMode.subscribe(mode => this.adminMode = mode);
    }

    onClkClient(client){
        this.modalService.showModal.next(true);
        this.clientService.adminMode.next('detail-mode');
        this.clientChanged(client);
    }

    onClkAddClient(){
        this.modalService.showModal.next(true);
        this.clientService.adminMode.next('add-mode');
    }

    ngOnDestroy(){
        this.tmp.forEach( subs => subs.unsubscribe() );
    }
}
