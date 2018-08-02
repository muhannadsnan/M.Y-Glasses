import { Branch } from "../models/branch";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()

export class BranchService {
    selectedBranch: Subject<any> = new Subject<any>(); 
	ClickedBranchCreate: Subject<any> = new Subject<any>(); 
	branchCreated: Subject<Branch> = new Subject<Branch>(); 
	branchDeleted: Subject<Branch> = new Subject<Branch>(); 
	loadingBranches: Subject<boolean> = new Subject<boolean>(); 

	showModal: Subject<boolean> = new Subject<boolean>();
    adminMode: Subject<string> = new Subject<string>();
	isLoggedin = false;
    dbUrl = "http://localhost:99";

    constructor(private http: HttpClient){}
    
    //********  CRUD FUNCTIONALITY  *********/
	readBranches() {
        return this.MAP(this.http.get(`${this.dbUrl}/branches`));
	}

	createBranch(newBranch: Branch): Observable<any>{
        return this.http.post(`${this.dbUrl}/branches`, newBranch, { responseType: 'text' /*important to receive JSON*/});
    }
    
    updateBranch(newBranch: Branch){
        return this.http.put(`${this.dbUrl}/branches/${newBranch.id}`, new Branch(null, newBranch.title, newBranch.desc), { responseType: 'text' /*important to receive JSON*/});        
	}

	destroyBranch(catid){
        return this.http.delete(`${this.dbUrl}/branches/${catid}`, { responseType: 'text' /*important to receive JSON*/});
	}
    //*************************************

	readBranchesByBranchId(catid) {
		this.loadingBranches.next(true);		
        return this.http.get(`${this.dbUrl}/branches/cat/${catid}`, { responseType: 'text' /*important to receive JSON*/});        
    }

    createQuantities(qtities): Observable<any>{
        // foreach qty.item.id
        return this.http.post(`${this.dbUrl}/quantities`, qtities, { responseType: 'text' /*important to receive JSON*/});
    }
    //--------------------------------------------------------------------
    	
	MAP(observable){
		return observable.pipe(
            map(actions => { //console.log("actions",actions);
                if(actions != null){  //console.log("res",res);
                    const res = Object.entries(actions);
                    return res.map(row => { //console.log("row",row);
                        return { id: row[0], ...row[1] }; //{id, ...data}
                    });
                }
                // return {noRows: res[0][1]};
			})
        )
	}
}