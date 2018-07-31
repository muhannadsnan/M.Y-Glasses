import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../../../models/item';
import { ItemService } from '../../../services/item.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
    @Input() item: Item;
    @Input() showAs: string;
    adminMode: string; // add, edit in modal
    isLoading: boolean;

    constructor(private itemService: ItemService,
                    private modalService: ModalService) { }

    ngOnInit() {
        this.itemService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add-mode')
                this.item = new Item();
        });       
        if(!this.showAs)
            this.showAs = 'list-group-item';
        this.itemService.selectedItem.subscribe(item => this.item = item);
    }

    
    onClickItem(){
        this.itemService.selectedItem.next(this.item);
    }
    
    switchAdminMode(mode){        
        this.itemService.adminMode.next(mode); console.log(this.adminMode);
    }
    
    saveChanges(){
        console.log("item", this.item);
        this.isLoading = true;
        this.itemService.updateItem(this.item).subscribe(resp => {
            console.log(resp);
            this.isLoading = false;
            this.itemService.adminMode.next('detail-mode');
        });
    }
    
    deleteItem(){
        if(confirm(`Delete item "${this.item.title}"?`)){
            this.isLoading = true;
            this.itemService.loadingItems.next(true);
            this.itemService.destroyItem(this.item.id).subscribe(resp => {
                console.log(resp);
                this.isLoading = false;
                this.modalService.showModal.next(false);
                this.itemService.loadingItems.next(false);
                this.itemService.itemDeleted.next(this.item);           
                this.item = new Item;
            });
        }
    }
}
