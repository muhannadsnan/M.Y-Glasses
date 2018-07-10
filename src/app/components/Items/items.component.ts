import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Observable } from '@firebase/util';

@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})

export class ItemsComponent implements OnInit {
  tmp;
  catId;
  items;
  loadingProds = true;
  itemsInRow = 2;

  constructor(private catService: CategoryService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.isLoadingProds();
    this.LISTEN_CategorySelected();
    this.LISTEN_Route();
    this.LISTEN_Route_data();
  }

  LISTEN_CategorySelected(){
     /* LISTEN TO SELECTING A CATEGORY TO TAKE PRODUCTS FROM THE SUBJECT */
    this.catService.selectedCategory.subscribe(selectedCat => { //console.log("selectedCat", selectedCat);
      //this.products = typeof selectedCat.products === 'undefined' ? [] : Object.values(selectedCat.products); // cat collection contains prods array
      this.getCatProds(selectedCat.id); //console.log("hiii ", selectedCat);
    });
  }

  LISTEN_Route(){
    // this.catId = this.route.snapshot.params.catid; console.log("snapshot", this.catId);
    this.route.params.subscribe(params => {
      this.catId = params['catid'];
      //if (typeof this.catId === 'undefined') console.log("catid", 'empty '); else console.log("catid", 'not empty: ' + this.catId);
      this.items = (typeof this.catId === 'undefined') ? this.getAllProds() : this.getCatProds(this.catId);
    }); /*  for å kunne vise meldingen "velg en kategori" kan vi bruke Subject her for å informere CategoriesCopmonent at det er en valgt kategori. */
  }

  LISTEN_Route_data(){
    this.route.data.subscribe(data => {  console.log("data", data);
      if(data.itemsInRow)
        this.itemsInRow = data.itemsInRow;
      else
        this.itemsInRow = 2;
    });
  }

  isLoadingProds() {
    this.catService.loadingProds.subscribe(isLoading => this.loadingProds = isLoading);
  }

  getAllProds() {
    return this.catService.readAllProducts();
  }

  getCatProds(catid) {
    //console.log("--- getCatProds ");
    return this.catService.readProdsByCatId(catid);
  }

}