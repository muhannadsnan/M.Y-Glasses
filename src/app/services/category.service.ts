import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Category } from "../models/category";
import { HttpClient } from "@angular/common/http";

@Injectable()

export class CategoryService {
	selectedCategory: Subject<any> = new Subject<any>(); 
	ClickedCategoryCreate: Subject<any> = new Subject<any>(); 
	categoryCreated: Subject<Category> = new Subject<Category>(); 
	categoryDeleted: Subject<Category> = new Subject<Category>(); 
	loadingCats: Subject<boolean> = new Subject<boolean>();

	showModal: Subject<boolean> = new Subject<boolean>();
    adminMode: Subject<string> = new Subject<string>();
	isLoggedin = false;
    dbUrl = "http://localhost:99";

    constructor(private http: HttpClient){}

    //********  CRUD FUNCTIONALITY  *********/
	readCats() {
        return this.MAP(this.http.get(`${this.dbUrl}/cats`));
	}

	createCat(newCat): Observable<any>{
        return this.http.post(`${this.dbUrl}/cats`, newCat, { responseType: 'text' /*important to receive JSON*/});
    }
    
    updateCat(newCat){
        return this.http.put(`${this.dbUrl}/cats/${newCat.id}`, new Category(null, newCat.title, newCat.desc), { responseType: 'text' /*important to receive JSON*/});        
	}

	destroyCat(catid){
        return this.http.delete(`${this.dbUrl}/cats/${catid}`, { responseType: 'text' /*important to receive JSON*/});
	}
    //*************************************
    	
	MAP(observable){
		return observable.pipe(
            map(actions => { //console.log("actions",actions);
                // this.loadingCats.next(false);  	
                const res = Object.entries(actions); 
				return res.map(a => { //console.log("a",a);
					const id = a[0]; const data = a[1]; return { id, ...data };
				})
			})
        )
	}
}