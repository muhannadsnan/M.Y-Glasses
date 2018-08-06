import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {
    orders;
    selectedId = 0;
    loadingOrders;
    showAs;
    // showModal;
    adminMode;

    constructor(private orderService: OrderService,
                private modalService: ModalService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() { //console.log("ordersss");
        this.LISTEN_LoadingOrders();
        this.LISTEN_CreateOrder();
        this.LISTEN_DeleteOrder();
        this.getOrders();
        this.showAs = 'grid';
        this.LISTEN_Data();
        this.LISTEN_AdminMode();
    }

    orderChanged(order) {
        this.selectedId = order.id;
        this.orderService.selectedOrder.next(order);
    }

    getOrders(){
        this.orderService.loadingOrders.next(true);
        this.orderService.readOrders().subscribe(resp => { //console.log("resp", resp);
            if(typeof resp === "undefined"){
                this.orders = [];
            }else{
                this.orders = resp;
            }
            this.orderService.loadingOrders.next(false);
        });
    }

    LISTEN_LoadingOrders(){
        this.orderService.loadingOrders.subscribe(isLoading => this.loadingOrders = isLoading);
    }

    LISTEN_CreateOrder(){
        this.orderService.orderCreated.subscribe(createdOrder => {
            this.orders.unshift(createdOrder);
        });
    }
    
    LISTEN_DeleteOrder(){
        this.orderService.orderDeleted.subscribe(deletedOrder => { 
            this.orders = this.orders.filter(order => order !== deletedOrder);
        });
    }

    LISTEN_Data(){
        this.route.data.subscribe(data => { //console.log("showAs", this.showAs);
            if(data.showAs){
            this.showAs = data.showAs; console.log("data ", data);
            }
        });
    }

    LISTEN_AdminMode(){
        this.orderService.adminMode.subscribe(mode => this.adminMode = mode);
    }

    onClkOrder(order){
        this.modalService.showModal.next(true);
        this.orderService.adminMode.next('detail-mode');
        this.orderChanged(order);
    }

    onClkAddOrder(){
        this.modalService.showModal.next(true);
        this.orderService.adminMode.next('add-mode');
    }

    onCreateOrder(){
        this.orderService.ClickedOrderCreate.next(true);
        this.orderService.loadingOrders.next(true);
    }
}