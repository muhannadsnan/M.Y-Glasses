import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  @Input() category: Category;
  @Input() showAs: string;
  editMode: boolean;
  adminMode: string; // add, edit in modal

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
        this.categoryService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add')
                this.category = new Category();
        });       
        if(!this.showAs)
            this.showAs = 'list-group-item';
        this.categoryService.selectedCategory.subscribe(category => this.category = category);
   }

  onDelCat(key){
    this.categoryService.destroyCat(key);
  }

  onClickCat(){
    this.categoryService.selectedCategory.next(this.category);
  }

  switchEditMode(mode){        
    this.editMode = mode; console.log(this.editMode);
  }
  
  saveChanges(){
    this.categoryService.updateCat(this.category);
    this.editMode = false;
  }



}
