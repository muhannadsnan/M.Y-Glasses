import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Client } from '../../../models/client';
import { ClientService } from '../../../services/client.service';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit, OnDestroy {
    @Input() client: Client; 
    tmp: Subscription;
    isLoading: boolean;
    isLoadingCats: boolean;
    categories;

    constructor(private clientService: ClientService, 
                    private categoryService: CategoryService,
                    private modalService: ModalService) { }

    ngOnInit() {
        this.isLoading = false;
        this.InitClient();
        this.Listen_OnClickCreateClient();
        this.readCategories();
    }

    InitClient(){
        if( ! this.client ){ //console.log("this.client has been initialized!");
            this.client = new Client
        }
    }

    Listen_OnClickCreateClient(){
        this.tmp = this.clientService.ClickedClientCreate.subscribe(isCreated => {
            if(isCreated){
                this.isLoading = true;
                this.Listen_CreateClient();
            }
        });
    }

    Listen_CreateClient(){
        this.clientService.createClient(this.client).subscribe(resp => {
            this.modalService.showModal.next(false);
            //toastr msg
            this.isLoading = false;
            this.clientService.loadingClients.next(false);
            console.log("resp create client", resp);
            this.client.id = resp;
            this.clientService.clientCreated.next(this.client);
            this.client = new Client;
        });
    }

    readCategories(){
        this.isLoadingCats = true;
        this.categoryService.MAP_List_Value_label(this.categoryService.readCats())
        .subscribe(resp => { //console.log("read cats", resp);
            if(typeof resp === "undefined"){
                this.categories = [];
            }else{
                this.categories = resp; 
            }     
            this.isLoadingCats = false;
        });
    }

    ngOnDestroy(){
        this.tmp.unsubscribe();
    }

}
