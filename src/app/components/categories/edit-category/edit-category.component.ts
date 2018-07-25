import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit, OnDestroy {
    @Input() category: Category; 
    tmp: Subscription;
    isLoading: boolean;

    constructor(private categoryService: CategoryService) { }

    ngOnInit() {
        this.isLoading = false;
        this.InitCat();
        this.Listen_OnClickCreateCat();
    }

    InitCat(){
        if( ! this.category ){ //console.log("this.category has been initialized!");
            this.category = new Category
        }
    }

    Listen_OnClickCreateCat(){
        this.tmp = this.categoryService.ClickedCategoryCreate.subscribe(isCreated => {
            if(isCreated){
                this.isLoading = true;
                this.Listen_CreateCat();
            }
        });
    }

    Listen_CreateCat(){
        this.categoryService.createCat(this.category).subscribe(resp => {
            this.categoryService.showModal.next(false);
            //toastr msg
            this.isLoading = false;
            this.categoryService.loadingCats.next(false);
            console.log("resp create cat", resp);
            this.category.id = resp;
            this.categoryService.categoryCreated.next(this.category);
            this.category = new Category;
        });
    }

    ngOnDestroy(){
        this.tmp.unsubscribe();
    }

}
