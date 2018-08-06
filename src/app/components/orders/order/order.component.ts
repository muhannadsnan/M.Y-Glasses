import { Component, OnInit, Input } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
    @Input() order: Order;
    @Input() showAs: string;
    adminMode: string; // add, edit in modal
    isLoading: boolean;

    constructor(private orderService: OrderService,
                    private modalService: ModalService) { }

    ngOnInit() {
        this.orderService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add-mode')
                this.order = new Order();
        });       
        if(!this.showAs)
            this.showAs = 'list-group-order';
        this.orderService.selectedOrder.subscribe(order => this.order = order);
    }

    
    onClickOrder(){
        this.orderService.selectedOrder.next(this.order);
    }
    
    switchAdminMode(mode){        
        this.orderService.adminMode.next(mode); console.log(this.adminMode);
    }
    
    saveChanges(){
        console.log("order", this.order);
        this.isLoading = true;
        this.orderService.updateOrder(this.order).subscribe(resp => {
            console.log(resp);
            this.isLoading = false;
            this.orderService.adminMode.next('detail-mode');
        });
    }
    
    deleteOrder(){
        if(confirm(`Delete order "${this.order.title}"?`)){
            this.isLoading = true;
            this.orderService.loadingOrders.next(true);
            this.orderService.destroyOrder(this.order.id).subscribe(resp => {
                console.log(resp);
                this.isLoading = false;
                this.modalService.showModal.next(false);
                this.orderService.loadingOrders.next(false);
                this.orderService.orderDeleted.next(this.order);           
                this.order = new Order;
            });
        }
    }
}
