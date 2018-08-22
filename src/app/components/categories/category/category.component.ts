import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { ModalService } from '../../../services/modal.service';
import { Subscription } from '../../../../../node_modules/rxjs';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {
    @Input() category: Category;
    @Input() showAs: string;
    adminMode: string; // add, edit in modal
    isLoading: boolean = false;
    tmp: Subscription[] = [];

    constructor(private categoryService: CategoryService,
                    private modalService: ModalService,
                    private route: ActivatedRoute,
                    private router: Router) { }

    ngOnInit() { // order is important here        
        this.LISTEN_AdminMode();
        this.INIT_Data();
        this.LISTEN_Params();
        this.tmp[1] = this.categoryService.selectedCategory.subscribe(category => this.category = category);
        if(typeof this.category == 'undefined' && this.showAs != 'table') {// means we will request the category
            this.LOADING(true);
        }
        if( !this.showAs)
            this.showAs = 'list-group-item';
    }

    LISTEN_AdminMode(){
        this.tmp[0] = this.categoryService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add-mode')
                this.category = new Category();
        });
    }

    INIT_Data(){
        this.tmp[4] = this.route.data.subscribe(data => {
            this.showAs = data.showAs;
            if(data.adminMode)
                this.categoryService.adminMode.next(data.adminMode);
        } ); 
    }

    LISTEN_Params(){
        this.tmp[5] = this.route.params.subscribe(params => { //console.log("params", params);
            if(this.showAs == "details" && (this.adminMode == "edit-mode" || this.adminMode == "detail-mode")){ // so dont request in /admin/categories when showAs table
                this.tmp[6] = this.categoryService.getCategoryById(params.id).subscribe(category =>{ //console.log("category", category)
                    if(typeof category == "undefined" || category === null){
                        alert("The object you are trying to reach is not available!");
                    }else{
                        this.category = category;
                        this.category.id = params.id;
                        this.LOADING(false);
                    }
                });
            }
        });
    }

    onClickCat(){
        this.categoryService.selectedCategory.next(this.category);
    }

    switchAdminMode(mode){        
        this.categoryService.adminMode.next(mode); console.log(this.adminMode);
    }

    navigateByAdminMode(mode){
        let navigateUrl = [];
        if(mode == "edit-mode")
            navigateUrl = ['admin', 'categories', this.category.id, 'edit'];
        else if(mode == "detail-mode")
            navigateUrl = ['admin', 'categories', this.category.id];
        this.router.navigate(navigateUrl);
    }

    navTo(url){
        this.router.navigateByUrl(url);
    }
    
    deleteCategory(){
        if(confirm(`Delete category "${this.category.title}"?`)){
            this.LOADING(true);
            this.categoryService.loadingCats.next(true);
            this.tmp[3] = this.categoryService.destroyCat(this.category.id).subscribe(resp => {
                console.log(resp);
                this.LOADING(false);
                this.modalService.showModal.next(false);
                this.categoryService.loadingCats.next(false);
                this.categoryService.categoryDeleted.next(this.category);           
                this.category = new Category;
                this.router.navigateByUrl("/admin/categories");
            });
        }
    }

    LOADING(value){
        this.isLoading = value;
        this.modalService.isLoading.next(value);
    }

    ngOnDestroy(){
        this.tmp.forEach( el => el.unsubscribe() );
    }
}
