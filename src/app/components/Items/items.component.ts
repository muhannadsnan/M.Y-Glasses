import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})

export class ItemsComponent implements OnInit {
    items;
    selectedId = 0;
    loadingItems;
    showAs;
    // showModal;
    adminMode;

    constructor(private itemService: ItemService,
                private modalService: ModalService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() { //console.log("itemsss");
        this.LISTEN_LoadingItems();
        this.LISTEN_CreateItem();
        this.LISTEN_DeleteItem();
        this.getItems();
        this.showAs = 'grid';
        this.LISTEN_Data();
        this.LISTEN_AdminMode();
    }

    itemChanged(item) {
        this.selectedId = item.id;
        this.itemService.selectedItem.next(item);
    }

    getItems(){
        this.itemService.loadingItems.next(true);
        this.itemService.readItems().subscribe(resp => { //console.log("resp", resp);
            this.items = resp;
            this.itemService.loadingItems.next(false);
        });
    }

    LISTEN_LoadingItems(){
        this.itemService.loadingItems.subscribe(isLoading => this.loadingItems = isLoading);
    }

    LISTEN_CreateItem(){
        this.itemService.itemCreated.subscribe(createdItem => {
            this.items.unshift(createdItem);
        });
    }
    
    LISTEN_DeleteItem(){
        this.itemService.itemDeleted.subscribe(deletedItem => { 
            this.items = this.items.filter(item => item !== deletedItem);
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
        this.itemService.adminMode.subscribe(mode => this.adminMode = mode);
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

    onCreateItem(){
        this.itemService.ClickedItemCreate.next(true);
        this.itemService.loadingItems.next(true);
    }
}