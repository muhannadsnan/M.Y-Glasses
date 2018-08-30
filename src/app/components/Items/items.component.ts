import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})

export class ItemsComponent implements OnInit, OnDestroy {
    items;
    selectedId = 0;
    selectedCat = 0;
    loadingItems = false;
    showAs;
    adminMode;
    tmp: Subscription[] = [];

    constructor(private itemService: ItemService,
                private categoryService: CategoryService,
                private modalService: ModalService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() { //console.log("itemsss");
        this.LISTEN_SelectedCat_GetItems();
        this.LISTEN_CreateItems();
        this.LISTEN_DeleteItems();
        this.getItems(); // with respect for params
        this.showAs = 'grid';
        this.LISTEN_Data();
        this.LISTEN_Params();
        this.LISTEN_AdminMode_itemService();
    }
    
    LISTEN_SelectedCat_GetItems(){
        this.tmp[6] = this.categoryService.selectedCategory.subscribe(cat => {
            this.selectedCat = cat;
            this.readItemsByCat(cat.id);
        });
    }

    itemChanged(item) { //console.log("item clicked",item);
        this.selectedId = item.id;
        this.itemService.selectedItem.next(item);
    }

    getItems(catid = 0){
        this.loadingItems = true;
        if(this.route.snapshot.params.catid){
            this.readItemsByCat(this.route.snapshot.params.catid);
        }else{ // read all
            this.readAllItems();
        }
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

    LISTEN_Params(){
        this.tmp[8] = this.route.params.subscribe(params => { console.log(params);
            if(params.catid){
                this.readItemsByCat(params.catid);
            }
        });
    }

    readItemsByCat(catid){
        this.loadingItems = true;
        this.tmp.push(this.itemService.readItemsByCatId(catid).subscribe(items => {
            this.items = items;
            this.loadingItems = false;
        }));
    }
    readAllItems(){
        this.tmp.push(        
            this.tmp[0] = this.itemService.readItems().subscribe(resp => { //console.log("resp", resp);
                if(typeof resp === "undefined"){
                    this.items = [];
                }else{
                    this.items = resp;
                }            
                this.loadingItems = false;
            }
        ));
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
