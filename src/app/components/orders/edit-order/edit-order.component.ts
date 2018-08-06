import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit, OnDestroy {
    @Input() order: Order; 
    tmp: Subscription;
    isLoading: boolean;
    isLoadingCats: boolean;
    categories;

    constructor(private orderService: OrderService, 
                    private categoryService: CategoryService,
                    private modalService: ModalService) { }

    ngOnInit() {
        this.isLoading = false;
        this.InitOrder();
        this.Listen_OnClickCreateOrder();
        this.readCategories();
    }

    InitOrder(){
        if( ! this.order ){ //console.log("this.order has been initialized!");
            this.order = new Order
        }
    }

    Listen_OnClickCreateOrder(){
        this.tmp = this.orderService.ClickedOrderCreate.subscribe(isCreated => {
            if(isCreated){
                this.isLoading = true;
                this.Listen_CreateOrder();
            }
        });
    }

    Listen_CreateOrder(){
        this.orderService.createOrder(this.order).subscribe(resp => {
            this.modalService.showModal.next(false);
            //toastr msg
            this.isLoading = false;
            this.orderService.loadingOrders.next(false);
            console.log("resp create order", resp);
            this.order.id = resp;
            this.orderService.orderCreated.next(this.order);
            this.order = new Order;
        });
    }

    readCategories(){
        this.isLoadingCats = true;
        this.categoryService.MAP_List_Value_label(this.categoryService.readCats())
        .subscribe(resp => { //console.log("read cats", resp);
            if(typeof resp === "undefined"){
                this.categories = [];
            }else{
                this.categories = resp; 
            }     
            this.isLoadingCats = false;
        });
    }

    ngOnDestroy(){
        this.tmp.unsubscribe();
    }

}
