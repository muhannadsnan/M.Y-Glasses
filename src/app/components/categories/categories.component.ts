import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../models/category';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {
    categories;
    selectedId = 0;
    loadingCats;
    showAs;
    // showModal;
    adminMode;

    constructor(private categoryService: CategoryService,
                private modalService: ModalService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() { //console.log("catsss");
        this.LISTEN_LoadingCats();
        this.LISTEN_CreateCategory();
        this.LISTEN_DeleteCategory();
        this.getCats();
        this.showAs = 'grid';
        this.LISTEN_Data();
        this.LISTEN_AdminMode();
    }

    catChanged(cat) {
        this.selectedId = cat.id;
        this.categoryService.selectedCategory.next(cat);
    }

    getCats(){
        this.categoryService.loadingCats.next(true);
        this.categoryService.readCats().subscribe(resp => { //console.log("resp", resp);
            this.categories = resp;
            this.categoryService.loadingCats.next(false);
        });
    }

    LISTEN_LoadingCats(){
        this.categoryService.loadingCats.subscribe(isLoading => this.loadingCats = isLoading);
    }

    LISTEN_CreateCategory(){
        this.categoryService.categoryCreated.subscribe(createdCat => {
            this.categories.unshift(createdCat);
        });
    }
    
    LISTEN_DeleteCategory(){
        this.categoryService.categoryDeleted.subscribe(deletedCat => { 
            this.categories = this.categories.filter(cat => cat !== deletedCat);
        });
    }

    LISTEN_Data(){
        this.route.data.subscribe(data => { //console.log("showAs", this.showAs);
            if(data.showAs){
            this.showAs = data.showAs; console.log("data ", data);
            }
        });
    }

    LISTEN_AdminMode(){
        this.categoryService.adminMode.subscribe(mode => this.adminMode = mode);
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

    onCreateCat(){
        this.categoryService.ClickedCategoryCreate.next(true);
        this.categoryService.loadingCats.next(true);
    }
}
