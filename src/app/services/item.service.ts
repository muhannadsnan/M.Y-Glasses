import { Item } from "../models/item";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

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
    dbUrl = environment.db.url;

    constructor(private http: HttpClient){}
    
    //********  CRUD FUNCTIONALITY  *********/
	readItems() {
        return this.MAP(this.http.get(`${this.dbUrl}/items`));
	}

	createItem(newItem: Item): Observable<any>{
        return this.http.post(`${this.dbUrl}/items`, newItem, { responseType: 'text' /*important to receive JSON*/});
    }
    
    updateItem(newItem: Item){
        return this.http.put(`${this.dbUrl}/items/${newItem.id}`, new Item(null, newItem.catid, newItem.title, newItem.desc, newItem.price, newItem.img), { responseType: 'text' /*important to receive JSON*/});        
	}

	destroyItem(catid){
        return this.http.delete(`${this.dbUrl}/items/${catid}`, { responseType: 'text' /*important to receive JSON*/});
	}
    //*************************************

	readItemsByItemId(catid) {
		this.loadingItems.next(true);		
        return this.MAP(this.http.get(`${this.dbUrl}/items/cat/${catid}`, { responseType: 'text' /*important to receive JSON*/}));
    }
        
    searchItemsByTitle(keyword){
        this.loadingItems.next(true);
        return this.MAP_List_Value_label(this.http.get(`${this.dbUrl}/items/search/${keyword}`));
    }
    //--------------------------------------------------------------------
    getItembyId(id) {
        return this.http.get(`${this.dbUrl}/items/${id}`);
	}    
    
	MAP(observable){
		return observable.pipe(
            map(actions => { //console.log("actions",actions);
                // this.loadingItems.next(false);	
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
                    return res.map(a =>{ //console.log("res",res);console.log("a", a);
                        return { "value": a[0], "label": a[1].title };
                    } );
                }
            })
        );
    }
}