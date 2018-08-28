import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})

export class ItemsComponent implements OnInit, OnDestroy {
    items;
    selectedId = 0;
    loadingItems;
    showAs;
    adminMode;
    tmp: Subscription[] = [];

    constructor(private itemService: ItemService,
                private modalService: ModalService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() { //console.log("itemsss");
        this.LISTEN_LoadingItems();
        this.LISTEN_CreateItems();
        this.LISTEN_DeleteItems();
        this.getItems();
        this.showAs = 'grid';
        this.LISTEN_Data();
        this.LISTEN_AdminMode_itemService();
    }

    itemChanged(item) { //console.log("item clicked",item);
        this.selectedId = item.id;
        this.itemService.selectedItem.next(item);
    }

    getItems(){
        this.itemService.loadingItems.next(true);
        this.tmp[0] = this.itemService.readItems().subscribe(resp => { //console.log("resp", resp);
            if(typeof resp === "undefined"){
                this.items = [];
            }else{
                this.items = resp;
            }            
            this.itemService.loadingItems.next(false);
        });
    }

    LISTEN_LoadingItems(){
        this.tmp[1] = this.itemService.loadingItems.subscribe(isLoading => this.loadingItems = isLoading);
    }

    LISTEN_CreateItems(){
        this.tmp[2] = this.itemService.itemCreated.subscribe(createdItem => {
            this.items.unshift(createdItem);
        });
    }
    
    LISTEN_DeleteItems(){
        this.tmp[3] = this.itemService.itemDeleted.subscribe(deletedItem => { 
            this.items = this.items.filter(item => item !== deletedItem);
        });
    }

    LISTEN_Data(){
        this.tmp[4] = this.route.data.subscribe(data => { //console.log("showAs", this.showAs);
            if(data.showAs){
                this.showAs = data.showAs; //console.log("data ", data);
            }
        });
    }

    LISTEN_AdminMode_itemService(){
        this.tmp[5] = this.itemService.adminMode.subscribe(mode => this.adminMode = mode);
    }

    onClkItem(item){
        this.modalService.showModal.next(true);
        this.itemService.adminMode.next('detail-mode');
        this.itemChanged(item);
    }

    onClkAddItem(){
        this.modalService.showModal.next(true);
        this.itemService.adminMode.next('add-mode');
    }

    ngOnDestroy(){
        this.tmp.forEach( subs => subs.unsubscribe() );
    }
}
