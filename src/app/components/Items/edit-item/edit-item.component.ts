import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Item } from '../../../models/item';
import { ItemService } from '../../../services/item.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit, OnDestroy {
    @Input() item: Item; 
    categories;
    adminMode;
    isLoading: boolean;
    isLoadingCats: boolean;
    tmp: Subscription[] = [];

    constructor(private itemService: ItemService,
                    private categoryService: CategoryService,
                    private modalService: ModalService,
                    private route: ActivatedRoute) { }

    ngOnInit() {
        this.LOADING(false);
        this.LISTEN_AdminMode_itemService();
        this.InitItem();
        this.readCategories();
    }

    InitItem(){
        if( ! this.item ){ //console.log("this.item has been initialized!");
            this.item = new Item
            this.adminMode = "add-mode"
        }else this.adminMode = "edit-mode"
    }

    INIT_Data(){
        this.tmp[4] = this.route.data.subscribe(data => {
            if(data.adminMode)
                this.itemService.adminMode.next(data.adminMode);
        } ); 
    }

    LISTEN_AdminMode_itemService(){
        this.tmp[0] = this.itemService.adminMode.subscribe(mode => { console.log(mode);
            this.adminMode = mode;
            if(mode == 'add-mode') // to reset after edit-mode
                this.item = new Item();
        });
    }

    onCreateItem(){
        this.LOADING(true);
        this.tmp[2] = this.itemService.createItem(this.item).subscribe(resp => {
            this.modalService.showModal.next(false);
            //toastr msg
            this.LOADING(false);
            this.itemService.loadingItems.next(false);
            console.log("resp create item", resp);
            this.item.id = resp;
            this.itemService.itemCreated.next(this.item);
            this.item = new Item;
        });
    }

    switchAdminMode(mode){        
        this.itemService.adminMode.next(mode); console.log(this.adminMode);
    }

    readCategories(){
        this.isLoadingCats = true;
        this.categoryService.MAP_List_Value_label(this.categoryService.readCats())
            .subscribe(resp => { console.log("read cats", resp);
                if(typeof resp === "undefined"){
                    this.categories = [];
                }else{
                    this.categories = resp; 
                }     
                this.isLoadingCats = false;
            });
    }

    saveChanges(){
        this.LOADING(true);
        this.tmp[2] = this.itemService.updateItem(this.item).subscribe(resp => { console.log(resp);
            this.LOADING(false);
            this.itemService.adminMode.next('detail-mode');
        });
    }

    LOADING(value){
        this.isLoading = value;
        this.modalService.isLoading.next(value);
    }

    ngOnDestroy(){
        this.tmp.forEach( el => el.unsubscribe() );
    }

}
