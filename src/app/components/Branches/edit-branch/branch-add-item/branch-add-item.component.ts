import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { BranchService } from '../../../../services/branch.service';
import { Item } from '../../../../models/item';
import { Branch } from '../../../../models/branch';
import { ItemService } from '../../../../services/item.service';

@Component({
  selector: 'app-branch-add-item',
  templateUrl: './branch-add-item.component.html',
  styleUrls: ['./branch-add-item.component.css']
})
export class BranchAddItemComponent implements OnInit {
    isLoading;
    isLoadingItems;
    searchResult;
    qtities; //{qty: number, item: Item, branchId: string}
    selectedItem: Item;
    @Input() branch: Branch;
    @ViewChild('qty') qty: ElementRef;

    constructor(private branchService: BranchService,
                    private itemService: ItemService) { }

    ngOnInit() {
        this.isLoading = false;
        this.LISTEN_isLoadingItems();
        this.qtities = [];
        this.selectedItem = new Item(null);
    }

    switchAdminMode(mode){
        this.branchService.adminMode.next(mode); 
    } 

    LISTEN_isLoadingItems(){
        this.itemService.loadingItems.subscribe(isLoading => this.isLoadingItems = isLoading);
    }

    searchItems(event){ // by title for now
        // console.log(event.target.value);
        this.itemService.loadingItems.next(true);
        this.itemService.searchItemsByTitle(event.target.value).subscribe(resp => {
            this.itemService.loadingItems.next(false);
            this.searchResult = resp; console.log("resp", resp);
        });
    } 

    onSelectedItem(option){ //console.log("selectedOption", option);
        this.selectedItem = new Item(option.value, null, option.label);  //console.log("selectedItem", this.selectedItem);
    }

    addItemToList(){ //console.log("qty record added: ", {qty: +this.qty.nativeElement.value, item: this.selectedItem, branchId: this.branch.id});
        this.qtities.push({qty: +this.qty.nativeElement.value, item: this.selectedItem, branchId: this.branch.id});
        this.selectedItem = new Item(null);
    }

    saveQuantities(){ console.log("qtities", this.qtities);
        this.isLoading = true;
        this.branchService.createQuantities(this.qtities).subscribe(resp => {
            this.isLoading = false;
            console.log(resp);
            this.switchAdminMode('detail-mode')
        });
    }
}
