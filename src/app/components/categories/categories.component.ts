import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit, OnDestroy {
    categories;
    selectedId = 0;
    loadingCats = false;
    showAs;
    adminMode;
    tmp: Subscription[] = [];

    constructor(private categoryService: CategoryService,
                private modalService: ModalService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() { //console.log("catsss");
        // this.LISTEN_LoadingCats();
        this.LISTEN_CreateCategory();
        this.LISTEN_DeleteCategory();
        this.getCats();
        this.showAs = 'grid';
        this.LISTEN_Data();
        this.LISTEN_AdminMode_catService();
    }

    catChanged(cat) { //console.log("cat clicked",cat);
        // this.selectedId = cat.id;
        this.categoryService.selectedCategory.next(cat);
    }

    getCats(){
        // this.categoryService.loadingCats.next(true);
        this.loadingCats = true;
        this.tmp[0] = this.categoryService.readCats().subscribe(resp => { //console.log("resp", resp);
            if(typeof resp === "undefined"){
                this.categories = [];
            }else{
                this.categories = resp;
            }            
            // this.categoryService.loadingCats.next(false);
            this.loadingCats = false;
        });
    }

    // LISTEN_LoadingCats(){
    //     this.tmp[1] = this.categoryService.loadingCats.subscribe(isLoading => this.loadingCats = isLoading);
    // }

    LISTEN_CreateCategory(){
        this.tmp[2] = this.categoryService.categoryCreated.subscribe(createdCat => {
            this.categories.unshift(createdCat);
        });
    }
    
    LISTEN_DeleteCategory(){
        this.tmp[3] = this.categoryService.categoryDeleted.subscribe(deletedCat => { 
            this.categories = this.categories.filter(cat => cat !== deletedCat);
        });
    }

    LISTEN_Data(){
        this.tmp[4] = this.route.data.subscribe(data => { //console.log("showAs", this.showAs);
            if(data.showAs){
                this.showAs = data.showAs; //console.log("data ", data);
            }
        });
    }

    LISTEN_AdminMode_catService(){
        this.tmp[5] = this.categoryService.adminMode.subscribe(mode => this.adminMode = mode);
    }

    onClkCategory(category){
        this.modalService.showModal.next(true);
        this.categoryService.adminMode.next('detail-mode');
        this.catChanged(category);
    }

    onClkAddCategory(){
        this.modalService.showModal.next(true);
        this.categoryService.adminMode.next('add-mode');
    }

    ngOnDestroy(){
        this.tmp.forEach( subs => subs.unsubscribe() );
    }
}
