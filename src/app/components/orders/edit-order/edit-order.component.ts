import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { map } from "rxjs/operators";
import { ClientService } from '../../../services/client.service';
import { ItemService } from '../../../services/item.service';
import { BranchService } from '../../../services/branch.service';
import { InsuranceService } from '../../../services/insurance.service';
import { Client } from '../../../models/client';
import { EyePrescription } from '../../../models/eyePrescription';
import { Branch } from '../../../models/branch';
import { Insurance } from '../../../models/insurance';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit, OnDestroy {
    @Input() order: Order; 
    tmp: Subscription;
    isLoading: boolean;
    isLoadingItems: boolean;
    isLoadingBranches: boolean;
    isLoadingInsurances: boolean;
    isLoadingClients: boolean;
    items;
    branches;
    insurances;
    clients;
    searchClientsResult;
    searchItemsResult;
    txtEyePrescriptions: string[] = []; // left, right

    constructor(private orderService: OrderService, 
                    private clientService: ClientService,
                    private itemService: ItemService,
                    private branchService: BranchService,
                    private insuranceService: InsuranceService,
                    private modalService: ModalService) { }

    ngOnInit() {
        this.isLoading = false;
        this.InitOrder();
        this.Listen_OnClickCreateOrder();
        this.readBranches();
        this.readInsurances();
    }

    InitOrder(){
        if( ! this.order ){ //console.log("this.order has been initialized!");
            this.order = new Order(); //console.log("INIT ORDER  ", this.order);
        }
    }

    Listen_OnClickCreateOrder(){
        this.tmp = this.orderService.ClickedOrderCreate.subscribe(isCreated => {
            if(isCreated){
                this.isLoading = true;
                this.Listen_CreateOrder();
                console.log("ORDER   ",this.order);
            }
        });
    }

    Listen_CreateOrder(){ 
        let split = this.txtEyePrescriptions['left'].split(',');
        this.order.eyePrescriptions.left = new EyePrescription(split[0], split[1], split[2], split[3]);
        split = this.txtEyePrescriptions['right'].split(',');
        this.order.eyePrescriptions.right = new EyePrescription(split[0], split[1], split[2], split[3]);
        this.tmp = this.orderService.createOrder(this.order).subscribe(resp => {
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

    searchClients(event){ // by title for now
        // console.log(event.target.value);
        this.isLoadingClients = true;
        this.clientService.searchClientByName(event.target.value).subscribe(resp => {
            this.isLoadingClients = false;
            this.searchClientsResult = resp; console.log("searchClients resp ", resp);
        });
    } 

    onSelectedClient(option){ //console.log("selectedOption", option);
        this.order.client = new Client(option.value, option.label);  //console.log("this.order.client ", this.order.client );
    }
    onSelectedBranch(option){ //console.log("selectedOption", option);
        this.order.branch = new Branch(option.value, option.label);  //console.log("this.order.client ", this.order.client );
    }
    onSelectedInsurance(option){ //console.log("selectedOption", option);
        this.order.insurance = new Insurance(option.value, option.label);  //console.log("this.order.client ", this.order.client );
    }

    searchItems(event){ // by title for now
        // console.log(event.target.value);
        this.isLoadingItems = true;
        this.itemService.searchItemsByTitle(event.target.value).subscribe(resp => {
            this.isLoadingItems = false;
            this.searchItemsResult = resp; console.log("searchItems resp ", resp);
        });
    } 

    onSelectedItem(option){ //console.log("selectedOption", option);
        this.order.items.push(new Client(option.value, option.label));  //console.log("this.order.items ", this.order.items );
    }

    readBranches(){
        this.isLoadingBranches = true;
        this.tmp = this.branchService.MAP_List_Value_label(this.branchService.readBranches())
            .subscribe(resp => { //console.log("read branches", resp);
                if(typeof resp === "undefined"){
                    this.branches = [];
                }else{
                    this.branches = resp; 
                }     
                this.isLoadingBranches = false;
            });
    }
    
    readInsurances(){
        this.isLoadingInsurances = true;
        this.tmp = this.insuranceService.MAP_List_Value_label(this.insuranceService.readInsurances())
            .subscribe(resp => { //console.log("read clients", resp);
                if(typeof resp === "undefined"){
                    this.insurances = [];
                }else{
                    this.insurances = resp; 
                }     
                this.isLoadingInsurances = false;
            });
    }

    ngOnDestroy(){
        this.tmp.unsubscribe();
    }

}
