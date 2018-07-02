import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../../../models/category';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { ItemService } from '../../../services/item.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @Input() category: Category;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
  }

  onDelCat(key){
    this.categoryService.destroyCat(key);
  }

  onClickCat(){
    this.categoryService.selectedCategory.next(this.category);
  }

}
