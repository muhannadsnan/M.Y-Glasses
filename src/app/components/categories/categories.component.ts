import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../models/category';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {
  categories: Observable<any[]>;
  selectedCat = 0;
  loadingCats;
  showAs;
  showModal;
  
  @ViewChild('catTitle') catTitle: ElementRef;

  constructor(private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() { //console.log("catsss");
    this.isLoadingCats();
    this.getCats();
    this.showAs = 'grid';
    this.LISTEN_Data();
  }

  catChanged(cat) {
    this.selectedCat = cat.id;
    this.categoryService.selectedCategory.next(cat);
  }

  onAddCat(){ 
    this.categoryService.createCat({ title: this.catTitle.nativeElement.value});
    this.catTitle.nativeElement.value = '';
  }

  getCats(){
    this.categories = this.categoryService.readCats();
  }

  isLoadingCats(){
    this.categoryService.loadingCats.subscribe(isLoading => this.loadingCats = isLoading);
  }

  LISTEN_Data(){
    this.route.data.subscribe(data => { //console.log("showAs", this.showAs);
      if(data.showAs){
        this.showAs = data.showAs; console.log("data ", data);
      }
    });
  }

  dblclickRow(){
    this.categoryService.showModal.next(true);
  }
}
