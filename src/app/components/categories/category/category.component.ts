import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  @Input() category: Category;
  @Input() showAs: string;
  adminMode: string; // add, edit in modal
  isLoading: boolean;

  constructor(private categoryService: CategoryService,
                    private modalService: ModalService) { }

  ngOnInit() {
      this.isLoading = false;
        this.categoryService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add-mode')
                this.category = new Category();
        });       
        if(!this.showAs)
            this.showAs = 'list-group-item';
        this.categoryService.selectedCategory.subscribe(category => this.category = category);
   }

   
   onClickCat(){
       this.categoryService.selectedCategory.next(this.category);
    }
    
    switchAdminMode(mode){        
        this.categoryService.adminMode.next(mode); console.log(this.adminMode);
    }
    
    saveChanges(){
        this.isLoading = true;
        this.categoryService.updateCat(this.category).subscribe(resp => {
            console.log(resp);
            this.isLoading = false;
            this.categoryService.adminMode.next('detail-mode');
        });
    }
    
    deleteCategory(){
        if(confirm(`Delete category "${this.category.title}"?`)){
            this.isLoading = true;
            this.categoryService.loadingCats.next(true);
            this.categoryService.destroyCat(this.category.id).subscribe(resp => {
                console.log(resp);
                this.isLoading = false;
                this.modalService.showModal.next(false);
                this.categoryService.loadingCats.next(false);
                this.categoryService.categoryDeleted.next(this.category);           
                this.category = new Category;
            });
        }
    }
}
