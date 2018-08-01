import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Item } from '../../../models/item';
import { ItemService } from '../../../services/item.service';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit, OnDestroy {
    @Input() item: Item; 
    tmp: Subscription;
    isLoading: boolean;
    isLoadingCats: boolean;
    categories;

    constructor(private itemService: ItemService, 
                    private categoryService: CategoryService,
                    private modalService: ModalService) { }

    ngOnInit() {
        this.isLoading = false;
        this.InitItem();
        this.Listen_OnClickCreateItem();
        this.readCategories();
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
            this.modalService.showModal.next(false);
            //toastr msg
            this.isLoading = false;
            this.itemService.loadingItems.next(false);
            console.log("resp create item", resp);
            this.item.id = resp;
            this.itemService.itemCreated.next(this.item);
            this.item = new Item;
        });
    }

    readCategories(){
        this.isLoadingCats = true;
        this.categoryService.readCats().pipe(
            map(actions => { //console.log("actions",actions);
                if(actions != null){
                    const res = Object.entries(actions); 
                    return res.map(a =>{ //console.log("res",res);console.log("a", a);
                        return { "value": a[1].id, "label": a[1].title };
                    } );
                }
			})
        ).subscribe(resp => { //console.log("read cats", resp);
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
