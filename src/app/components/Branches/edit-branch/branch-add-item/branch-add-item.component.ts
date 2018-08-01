import { Component, OnInit, Input } from '@angular/core';
import { BranchService } from '../../../../services/branch.service';
import { Item } from '../../../../models/item';
import { Branch } from '../../../../models/branch';

@Component({
  selector: 'app-branch-add-item',
  templateUrl: './branch-add-item.component.html',
  styleUrls: ['./branch-add-item.component.css']
})
export class BranchAddItemComponent implements OnInit {
    isLoading;
    isLoadingItems;
    searchResult;
    qtities: [{qty: number, itemId: string, branchId: string}];
    selectedItem: Item;
    @Input() branch: Branch;

    constructor(private branchService: BranchService) { }

    ngOnInit() {
        this.isLoading = false;
        this.isLoadingItems = false;
        this.searchResult = [
            {"value": "1", "label": "ttt1"},
            {"value": "2", "label": "ttt2"},
        ];
        this.qtities = [{qty: 0, itemId: "101", branchId: this.branch.id}];
        this.selectedItem = new Item("102", null, "title 102");
    }

    switchAdminMode(mode){
        this.branchService.adminMode.next(mode); 
    }

    searchItems(keyword){
        // this.branchService.searchItemsByTitle(keyword);
    }

    addItemToList(){

    }
}
