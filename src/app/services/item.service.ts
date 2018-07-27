import { Item } from "../models/item";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()

export class ItemService {
    selectedItem: Subject<any> = new Subject<any>(); 
	ClickedItemCreate: Subject<any> = new Subject<any>(); 
	itemCreated: Subject<Item> = new Subject<Item>(); 
	itemDeleted: Subject<Item> = new Subject<Item>(); 
	loadingItems: Subject<boolean> = new Subject<boolean>(); 

	showModal: Subject<boolean> = new Subject<boolean>();
    adminMode: Subject<string> = new Subject<string>();
	isLoggedin = false;
    dbUrl = "http://localhost:99";

    constructor(private http: HttpClient){}
    
    //********  CRUD FUNCTIONALITY  *********/
	readItems() {
        return this.MAP(this.http.get(`${this.dbUrl}/cats`));
	}

	createItem(newItem): Observable<any>{
        return this.http.post(`${this.dbUrl}/cats`, newItem, { responseType: 'text' /*important to receive JSON*/});
    }
    
    updateItem(newItem){
        return this.http.put(`${this.dbUrl}/cats/${newItem.id}`, new Item(null, newItem.title, newItem.desc), { responseType: 'text' /*important to receive JSON*/});        
	}

	destroyItem(catid){
        return this.http.delete(`${this.dbUrl}/cats/${catid}`, { responseType: 'text' /*important to receive JSON*/});
	}
    //*************************************

	readItemsByItemId(catid) {
		this.loadingItems.next(true);		
        return this.http.get(`${this.dbUrl}/items/cat/${catid}`, { responseType: 'text' /*important to receive JSON*/});        
	}
    //--------------------------------------------------------------------
    	
	MAP(observable){
		return observable.pipe(
            map(actions => { //console.log("actions",actions);
                // this.loadingItems.next(false);	
                const res = Object.entries(actions); 
				return res.map(a => { //console.log("a",a);
					const id = a[0]; const data = a[1]; return { id, ...data };
				})
			})
        )
	}
}