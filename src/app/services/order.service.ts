import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Order } from "../models/order";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()

export class OrderService {
	selectedOrder: Subject<any> = new Subject<any>(); 
	ClickedOrderCreate: Subject<any> = new Subject<any>(); 
	orderCreated: Subject<Order> = new Subject<Order>(); 
	orderDeleted: Subject<Order> = new Subject<Order>(); 
	loadingOrders: Subject<boolean> = new Subject<boolean>();

	showModal: Subject<boolean> = new Subject<boolean>();
    adminMode: Subject<string> = new Subject<string>();
	isLoggedin = false;
    dbUrl = environment.db.url;

    constructor(private http: HttpClient){}

    //********  CRUD FUNCTIONALITY  *********/
	readOrders() {
        return this.MAP(this.http.get(`${this.dbUrl}/orders`));
	}

	createOrder(newOrder: Order): Observable<any>{
        return this.http.post(`${this.dbUrl}/orders`, newOrder, { responseType: 'text' /*important to receive JSON*/});
    }
    
    updateOrder(newOrder: Order){
        return this.http.put(`${this.dbUrl}/orders/${newOrder.id}`, new Order(null, newOrder.client, newOrder.branchId, newOrder.insuranceId, newOrder.items, newOrder.eyePrescriptions, newOrder.desc), { responseType: 'text' /*important to receive JSON*/});        
	}

	destroyOrder(orderid){
        return this.http.delete(`${this.dbUrl}/orders/${orderid}`, { responseType: 'text' /*important to receive JSON*/});
	}
    //*************************************
    	
	MAP(observable){
		return observable.pipe(
            map(actions => { //console.log("actions",actions);
                // this.loadingOrders.next(false);  	
                if(actions != null){
                    const res = Object.entries(actions); 
                    return res.map(row => { //console.log("row",row);
                        const id = row[0]; const data = row[1]; return { id, ...data };
                    })
                }
			})
        )
    }
    
    MAP_List_Value_label(observable){
        return observable.pipe(
            map(actions => { //console.log("actions",actions);
                if(actions != null){
                    const res = Object.entries(actions); 
                    return res.map(a =>{ //console.log("res",res);//console.log("a", a);
                        return { "value": a[1].id, "label": a[1].title };
                    } );
                }
            })
        );
    }
}