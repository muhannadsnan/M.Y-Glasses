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
import { Client } from '../../../models/client';
import { EyePrescription } from '../../../models/eyePrescription';
import { Branch } from '../../../models/branch';
import { Item } from '../../../models/item';
import { ActivatedRoute } from '@angular/router';
import { Insurance } from '../../../models/insurance';
import { InsuranceService } from '../../../services/insurance.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit, OnDestroy {
    @Input() order: Order; 
    adminMode;
    isLoading: boolean;
    isLoadingItems: boolean;
    isLoadingBranches: boolean;
    isLoadingOrders: boolean;
    isLoadingClients: boolean;
    items;
    branches;
    insurances;
    clients;
    searchClientsResult;
    searchItemsResult;
    txtEyePrescriptions: string[] = []; // left, right
    tmp: Subscription[] = [];

    constructor(private orderService: OrderService, 
                    private insuranceService: InsuranceService,
                    private clientService: ClientService,
                    private itemService: ItemService,
                    private branchService: BranchService,
                    private modalService: ModalService,
                    private route: ActivatedRoute) { }

    ngOnInit() {
        this.LOADING(false);
        this.INIT_Data();
        this.LISTEN_AdminMode_orderService();
        this.InitOrder();
        this.readBranches();
        this.readInsurances();
    }

    InitOrder(){
        if( ! this.order ){ //console.log("this.order has been initialized!");
            this.order = new Order
            this.adminMode = "add-mode"
        }else this.adminMode = "edit-mode"
    }

    INIT_Data(){
        this.tmp[0] = this.route.data.subscribe(data => { console.log("adminMode", data.adminMode);
            if(data.adminMode)
                this.orderService.adminMode.next(data.adminMode);
        } ); 
    }

    LISTEN_AdminMode_orderService(){
        this.tmp[1] = this.orderService.adminMode.subscribe(mode => { console.log("admin mode",mode);
            this.adminMode = mode;
            if(mode == 'add-mode') // to reset after edit-mode
                this.order = new Order();
        });
    }

    onCreateOrder(){
        this.LOADING(true);
        let split = this.txtEyePrescriptions['left'].split(',');
        this.order.eyePrescriptions.left = new EyePrescription(split[0], split[1], split[2], split[3]);
        split = this.txtEyePrescriptions['right'].split(',');
        this.order.eyePrescriptions.right = new EyePrescription(split[0], split[1], split[2], split[3]);
        this.tmp[3] = this.orderService.createOrder(this.order).subscribe(resp => {
            this.modalService.showModal.next(false);
            //toastr msg
            this.LOADING(false);
            this.orderService.loadingOrders.next(false);
            console.log("resp create order", resp);
            this.order.id = resp;
            this.orderService.orderCreated.next(this.order);
            this.order = new Order;
        });
    }
    
    switchAdminMode(mode){        
        this.orderService.adminMode.next(mode); console.log(this.adminMode);
    }

    saveChanges(){
        this.LOADING(true);
        this.tmp[4] = this.orderService.updateOrder(this.order).subscribe(resp => { console.log(resp);
            this.LOADING(false);
            this.orderService.adminMode.next('detail-mode');
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
    
    searchItems(event){ // by title for now
        // console.log(event.target.value);
        this.isLoadingItems = true;
        this.itemService.searchItemsByTitle(event.target.value).subscribe(resp => {
            this.isLoadingItems = false;
            this.searchItemsResult = resp; console.log("searchItems resp ", resp);
        });
    } 

    readBranches(){
        this.isLoadingBranches = true;
        this.tmp[5] = this.branchService.MAP_List_Value_label(this.branchService.readBranches())
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
        this.isLoadingOrders = true;
        this.tmp[6] = this.insuranceService.MAP_List_Value_label(this.insuranceService.readInsurances())
            .subscribe(resp => { //console.log("read clients", resp);
                if(typeof resp === "undefined"){
                    this.insurances = [];
                }else{
                    this.insurances = resp; 
                }     
                this.isLoadingOrders = false;
            });
    }
    
    onSelectedClient(option){ //console.log("selectedOption", option);
        this.order.client = new Client(option.value, option.label);  //console.log("this.order.client ", this.order.client );
    }
    onSelectedBranch(option){ //console.log("selectedOption", option);
        this.order.branch = new Branch(option.value, option.label);  //console.log("this.order.Branch ", this.order.branch );
    }
    onSelectedInsurance(option){ //console.log("selectedOption", option);
        this.order.insurance = new Insurance(option.value, option.label);  //console.log("this.order.Insurance ", this.order.insurance );
    }

    onSelectedItem(option){ console.log("selectedOption", option);
        this.order.items.push(new Item(option.value, null, option.label));  //console.log("this.order.items ", this.order.items );
    }

    LOADING(value){
        this.isLoading = value;
        this.modalService.isLoading.next(value);
    }

    ngOnDestroy(){
        this.tmp.forEach( subs => subs.unsubscribe() );
    }
}
