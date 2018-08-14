import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Item } from '../../../models/item';
import { ItemService } from '../../../services/item.service';
import { ModalService } from '../../../services/modal.service';
import { Subscription } from '../../../../../node_modules/rxjs';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, OnDestroy {
    @Input() item: Item;
    @Input() showAs: string;
    adminMode: string; // add, edit in modal
    isLoading: boolean = false;
    tmp: Subscription[] = [];

    constructor(private itemService: ItemService,
                    private modalService: ModalService,
                    private route: ActivatedRoute,
                    private router: Router) { }

    ngOnInit() { // order is important here        
        this.LISTEN_AdminMode();
        this.INIT_Data();
        this.LISTEN_Params();
        this.tmp[1] = this.itemService.selectedItem.subscribe(item => this.item = item);
        if(typeof this.item == 'undefined' && this.showAs != 'table') {// means we will request the item
            this.LOADING(true);
        }
        if( !this.showAs)
            this.showAs = 'list-group-item';
    }

    LISTEN_AdminMode(){
        this.tmp[0] = this.itemService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add-mode')
                this.item = new Item();
        });
    }

    INIT_Data(){
        this.tmp[4] = this.route.data.subscribe(data => {
            this.showAs = data.showAs;
            if(data.adminMode)
                this.itemService.adminMode.next(data.adminMode);
        } ); 
    }

    LISTEN_Params(){
        this.tmp[5] = this.route.params.subscribe(params => { //console.log("params", params);
            if(this.showAs == "details" && (this.adminMode == "edit-mode" || this.adminMode == "detail-mode")){ // so dont request in /admin/items when showAs table
                this.tmp[6] = this.itemService.getItemById(params.id).subscribe(item =>{ //console.log("item", item)
                    if(typeof item == "undefined" || item === null){
                        alert("The object you are trying to reach is not available!");
                    }else{
                        this.item = item;
                        this.item.id = params.id;
                        this.LOADING(false);
                    }
                });
            }
        });
    }

    onClickItem(){
        this.itemService.selectedItem.next(this.item);
    }

    switchAdminMode(mode){        
        this.itemService.adminMode.next(mode); console.log(this.adminMode);
    }

    navigateByAdminMode(mode){
        let navigateUrl = [];
        if(mode == "edit-mode")
            navigateUrl = ['admin', 'items', this.item.id, 'edit'];
        else if(mode == "detail-mode")
            navigateUrl = ['admin', 'items', this.item.id];
        this.router.navigate(navigateUrl);
    }

    deleteItem(){
        if(confirm(`Delete item "${this.item.title}"?`)){
            this.LOADING(true);
            this.itemService.loadingItems.next(true);
            this.tmp[3] = this.itemService.destroyItem(this.item.id).subscribe(resp => {
                console.log(resp);
                this.LOADING(false);
                this.modalService.showModal.next(false);
                this.itemService.loadingItems.next(false);
                this.itemService.itemDeleted.next(this.item);           
                this.item = new Item;
            });
        }
    }

    navTo(url){
        this.router.navigateByUrl(url);
    }

    LOADING(value){
        this.isLoading = value;
        this.modalService.isLoading.next(value);
    }

    ngOnDestroy(){
        this.tmp.forEach( el => el.unsubscribe() );
    }
}
