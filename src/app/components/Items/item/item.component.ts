import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Product } from '../../../models/product';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { environment } from '../../../../environments/environment';
import { ItemService } from '../../../services/item.service';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input() item: Product;
  cloudinaryUrl = environment.cloudinary.url;
  editing = {enabled: false, title: false, desc: false, price: false};
  newItem;
  @ViewChild('txtEditTitle') txtEditTitle: ElementRef;
  @ViewChild('txtEditDesc') txtEditDesc: ElementRef;
  @ViewChild('txtEditPrice') txtEditPrice: ElementRef;
    
  constructor(private itemService: ItemService) { }

  ngOnInit() {
  }

  toggleEditing(){
    if(this.editing.enabled){
      this.editing = { enabled: false, title: false, desc: false, price: false }; 
      this.item.title = this.txtEditTitle.nativeElement.value ? this.txtEditTitle.nativeElement.value : this.item.title;
      this.item.desc= this.txtEditDesc.nativeElement.value ? this.txtEditDesc.nativeElement.value : this.item.desc;
      this.item.price= this.txtEditPrice.nativeElement.value ? this.txtEditPrice.nativeElement.value : this.item.price;
      this.itemService.updateProduct(this.item);      
      //console.log("hahaaaaaaaaaaaaaaaa",this.item);
    }
    this.editing.enabled = !this.editing.enabled    
  }
  editTitle(){
    if (this.editing.enabled) this.editing.title = true;
  }
  editDesc() {
    if (this.editing.enabled) this.editing.desc = true;
  }
  editPrice() {
    if (this.editing.enabled) this.editing.price = true;
  }

}
