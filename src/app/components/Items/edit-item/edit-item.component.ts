import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Item } from '../../../models/item';
import { ItemService } from '../../../services/item.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit, OnDestroy {
    @Input() item: Item; 
    tmp: Subscription;
    isLoading: boolean;

    constructor(private itemService: ItemService) { }

    ngOnInit() {
        this.isLoading = false;
        this.InitItem();
        this.Listen_OnClickCreateItem();
    }

    InitItem(){
        if( ! this.item ){ //console.log("this.item has been initialized!");
            this.item = new Item
        }
    }

    Listen_OnClickCreateItem(){
        this.tmp = this.itemService.ClickedItemCreate.subscribe(isCreated => {
            if(isCreated){
                this.isLoading = true;
                this.Listen_CreateItem();
            }
        });
    }

    Listen_CreateItem(){
        this.itemService.createItem(this.item).subscribe(resp => {
            this.itemService.showModal.next(false);
            //toastr msg
            this.isLoading = false;
            this.itemService.loadingItems.next(false);
            console.log("resp create item", resp);
            this.item.id = resp;
            this.itemService.itemCreated.next(this.item);
            this.item = new Item;
        });
    }

    ngOnDestroy(){
        this.tmp.unsubscribe();
    }

}
