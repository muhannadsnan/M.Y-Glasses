import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})

export class ClientsComponent implements OnInit {
    clients;
    selectedId = 0;
    loadingClients;
    showAs;
    // showModal;
    adminMode;

    constructor(private clientService: ClientService,
                private modalService: ModalService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() { //console.log("clientsss");
        this.LISTEN_LoadingClients();
        this.LISTEN_CreateClient();
        this.LISTEN_DeleteClient();
        this.getClients();
        this.showAs = 'grid';
        this.LISTEN_Data();
        this.LISTEN_AdminMode();
    }

    clientChanged(client) {
        this.selectedId = client.id;
        this.clientService.selectedClient.next(client);
    }

    getClients(){
        this.clientService.loadingClients.next(true);
        this.clientService.readClients().subscribe(resp => { //console.log("resp", resp);
            if(typeof resp === "undefined"){
                this.clients = [];
            }else{
                this.clients = resp;
            }
            this.clientService.loadingClients.next(false);
        });
    }

    LISTEN_LoadingClients(){
        this.clientService.loadingClients.subscribe(isLoading => this.loadingClients = isLoading);
    }

    LISTEN_CreateClient(){
        this.clientService.clientCreated.subscribe(createdClient => {
            this.clients.unshift(createdClient);
        });
    }
    
    LISTEN_DeleteClient(){
        this.clientService.clientDeleted.subscribe(deletedClient => { 
            this.clients = this.clients.filter(client => client !== deletedClient);
        });
    }

    LISTEN_Data(){
        this.route.data.subscribe(data => { //console.log("showAs", this.showAs);
            if(data.showAs){
            this.showAs = data.showAs; console.log("data ", data);
            }
        });
    }

    LISTEN_AdminMode(){
        this.clientService.adminMode.subscribe(mode => this.adminMode = mode);
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

    onCreateClient(){
        this.clientService.ClickedClientCreate.next(true);
        this.clientService.loadingClients.next(true);
    }
}