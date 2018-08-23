import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
    @Input() order: Order;  // order should have attribute "number", which is a timestamp
    @Input() showAs: string;
    adminMode: string; // add, edit in modal
    isLoading: boolean = false;
    tmp: Subscription[] = [];

    constructor(private orderService: OrderService,
                    private modalService: ModalService,
                    private route: ActivatedRoute,
                    private router: Router) { }

    ngOnInit() {// order is important here 
        this.LISTEN_AdminMode(); console.log(this.showAs);
        this.INIT_Data();
        this.LISTEN_Params();
        this.tmp[1] = this.orderService.selectedOrder.subscribe(order => this.order = order);
        if(typeof this.order == 'undefined' && this.showAs != 'table') {// means we will request the order
            this.LOADING(true);
        }
        if( this.showAs == '')
            this.showAs = 'list-group-order';
    }

    LISTEN_AdminMode(){
        this.tmp[0] = this.orderService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add-mode')
                this.order = new Order();
        });
    }

    INIT_Data(){
        this.tmp[4] = this.route.data.subscribe(data => {
            this.showAs = data.showAs;
            if(data.adminMode)
                this.orderService.adminMode.next(data.adminMode);
        } ); 
    }

    LISTEN_Params(){
        this.tmp[5] = this.route.params.subscribe(params => { //console.log("params", params);
            if(this.showAs == "details" && (this.adminMode == "edit-mode" || this.adminMode == "detail-mode")){ // so dont request in /admin/orders when showAs table
                this.tmp[6] = this.orderService.getOrderById(params.id).subscribe(order =>{ console.log("order", order)
                    if(typeof order == "undefined" || order === null){
                        alert("The object you are trying to reach is not available!");
                    }else{
                        this.order = order;
                        this.order.id = params.id;
                        this.LOADING(false);
                    }
                });
            }
        });
    }
    
    onClickOrder(){
        this.orderService.selectedOrder.next(this.order);
    }
    
    switchAdminMode(mode){        
        this.orderService.adminMode.next(mode); console.log(this.adminMode);
    }

    navigateByAdminMode(mode){
        let navigateUrl = [];
        if(mode == "edit-mode")
            navigateUrl = ['admin', 'orders', this.order.id, 'edit'];
        else if(mode == "detail-mode")
            navigateUrl = ['admin', 'orders', this.order.id];
        this.router.navigate(navigateUrl);
    }
    
    navTo(url){
        this.router.navigateByUrl(url);
    }
    
    deleteOrder(){
        if(confirm(`Delete order "${this.order.id}"?`)){ 
            this.LOADING(true);
            this.orderService.loadingOrders.next(true);
            this.tmp[3] = this.orderService.destroyOrder(this.order.id).subscribe(resp => {
                console.log(resp);
                this.LOADING(false);
                this.modalService.showModal.next(false);
                this.orderService.loadingOrders.next(false);
                this.orderService.orderDeleted.next(this.order);           
                this.order = new Order;
                this.router.navigateByUrl("/admin/orders");
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
