import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Category } from "../models/category";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

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
    dbUrl = environment.db.url;

    constructor(private http: HttpClient){}

    //********  CRUD FUNCTIONALITY  *********/
	readCats() {
        return this.MAP(this.http.get(`${this.dbUrl}/cats`));
	}

	createCat(newCat: Category): Observable<any>{
        return this.http.post(`${this.dbUrl}/cats`, newCat, { responseType: 'text' /*important to receive JSON*/});
    }
    
    updateCat(newCat: Category){
        return this.http.put(`${this.dbUrl}/cats/${newCat.id}`, new Category(null, newCat.title, newCat.desc), { responseType: 'text' /*important to receive JSON*/});        
	}

	destroyCat(catid){
        return this.http.delete(`${this.dbUrl}/cats/${catid}`, { responseType: 'text' /*important to receive JSON*/});
	}
    //*************************************
    getCategorybyId(id) {
        return this.http.get(`${this.dbUrl}/cats/${id}`);
	}
    	
	MAP(observable){
		return observable.pipe(
            map(actions => { //console.log("actions",actions);
                // this.loadingCats.next(false);  	
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