import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../../../models/item';
import { ItemService } from '../../../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
    @Input() item: Item;
    @Input() showAs: string;
    editMode: boolean;
    adminMode: string; // add, edit in modal

    constructor(private itemService: ItemService) { }

    ngOnInit() {
        this.itemService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add')
                this.item = new Item();
        });       
        if(!this.showAs)
            this.showAs = 'list-group-item';
        this.itemService.selectedItem.subscribe(item => this.item = item);
    }

    
    onClickItem(){
        this.itemService.selectedItem.next(this.item);
    }
    
    switchEditMode(mode){        
        this.editMode = mode; console.log(this.editMode);
    }
    
    saveChanges(){
        this.itemService.updateItem(this.item).subscribe(resp => console.log(resp));
        this.editMode = false;
    }
    
    deleteItem(){
        if(confirm(`Delete item "${this.item.title}"?`)){
            this.itemService.destroyItem(this.item.id).subscribe(resp => {
                console.log(resp);
                this.itemService.showModal.next(false);
                this.itemService.itemDeleted.next(this.item);           
                this.item = new Item;
            });
        }
    }
}
