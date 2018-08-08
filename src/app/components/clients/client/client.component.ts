import { Component, OnInit, Input } from '@angular/core';
import { Client } from '../../../models/client';
import { ClientService } from '../../../services/client.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
    @Input() client: Client;
    @Input() showAs: string;
    adminMode: string; // add, edit in modal
    isLoading: boolean;

    constructor(private clientService: ClientService,
                    private modalService: ModalService) { }

    ngOnInit() {
        this.clientService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add-mode')
                this.client = new Client();
        });       
        if(!this.showAs)
            this.showAs = 'list-group-client';
        this.clientService.selectedClient.subscribe(client => this.client = client);
    }

    
    onClickClient(){
        this.clientService.selectedClient.next(this.client);
    }
    
    switchAdminMode(mode){        
        this.clientService.adminMode.next(mode); console.log(this.adminMode);
    }
    
    saveChanges(){
        console.log("client", this.client);
        this.isLoading = true;
        this.clientService.updateClient(this.client).subscribe(resp => {
            console.log(resp);
            this.isLoading = false;
            this.clientService.adminMode.next('detail-mode');
        });
    }
    
    deleteClient(){
        if(confirm(`Delete client "${this.client.id}"?`)){
            this.isLoading = true;
            this.clientService.loadingClients.next(true);
            this.clientService.destroyClient(this.client.id).subscribe(resp => {
                console.log(resp);
                this.isLoading = false;
                this.modalService.showModal.next(false);
                this.clientService.loadingClients.next(false);
                this.clientService.clientDeleted.next(this.client);           
                this.client = new Client;
            });
        }
    }
}
