import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit, OnDestroy {
    @Input() category: Category; 
    adminMode;
    isLoading: boolean;
    tmp: Subscription[] = [];

    constructor(private categoryService: CategoryService,
                    private modalService: ModalService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.LOADING(false);
        this.LISTEN_AdminMode();
        this.InitCat();
    }

    InitCat(){
        if( ! this.category ){ //console.log("this.category has been initialized!");
            this.category = new Category
            this.adminMode = "add-mode"
        }else this.adminMode = "edit-mode"
    }

    INIT_Data(){
        this.tmp[4] = this.route.data.subscribe(data => {
            if(data.adminMode)
                this.categoryService.adminMode.next(data.adminMode);
        } ); 
    }

    LISTEN_AdminMode(){
        this.tmp[0] = this.categoryService.adminMode.subscribe(mode => { console.log(mode);
            this.adminMode = mode;
            if(mode == 'add-mode') // to reset after edit-mode
                this.category = new Category();
        });
    }

    onCreateCat(){
        this.LOADING(true);
        this.tmp[2] = this.categoryService.createCat(this.category).subscribe(resp => {
            this.modalService.showModal.next(false);
            //toastr msg
            this.LOADING(false);
            this.categoryService.loadingCats.next(false);
            console.log("resp create cat", resp);
            this.category.id = resp;
            this.categoryService.categoryCreated.next(this.category);
            this.category = new Category;
        });
    }

    switchAdminMode(mode){        
        this.categoryService.adminMode.next(mode); console.log(this.adminMode);
    }

    saveChanges(){
        this.LOADING(true);
        this.tmp[2] = this.categoryService.updateCat(this.category).subscribe(resp => { console.log(resp);
            this.LOADING(false);
            this.categoryService.adminMode.next('detail-mode');
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
