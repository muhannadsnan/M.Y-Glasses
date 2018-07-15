import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
    @Input() category: Category; 

    constructor(private categoryService: CategoryService) { }

    ngOnInit() {
    }

}
