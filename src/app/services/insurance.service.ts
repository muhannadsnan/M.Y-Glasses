import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Insurance } from "../models/insurance";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()

export class InsuranceService {
	selectedInsurance: Subject<any> = new Subject<any>(); 
	insuranceCreated: Subject<Insurance> = new Subject<Insurance>(); 
	insuranceDeleted: Subject<Insurance> = new Subject<Insurance>(); 
	loadingInsurances: Subject<boolean> = new Subject<boolean>();

	showModal: Subject<boolean> = new Subject<boolean>();
    adminMode: Subject<string> = new Subject<string>();
	isLoggedin = false;
    dbUrl = environment.db.url;

    constructor(private http: HttpClient){}

    //********  CRUD FUNCTIONALITY  *********/
	readInsurances() {
        return this.MAP(this.http.get(`${this.dbUrl}/insurances`));
	}

	createInsurance(newInsurance: Insurance): Observable<any>{
        return this.http.post(`${this.dbUrl}/insurances`, newInsurance, { responseType: 'text' /*important to receive JSON*/});
    }
    
    updateInsurance(newInsurance: Insurance){
        return this.http.put(`${this.dbUrl}/insurances/${newInsurance.id}`, new Insurance(null, newInsurance.title, newInsurance.desc), { responseType: 'text' /*important to receive JSON*/});        
	}

	destroyInsurance(insuranceid){
        return this.http.delete(`${this.dbUrl}/insurances/${insuranceid}`, { responseType: 'text' /*important to receive JSON*/});
	}
    //*************************************
    getInsuranceById(id) {
        return this.http.get(`${this.dbUrl}/insurances/${id}`);
	}    
    
	MAP(observable){
		return observable.pipe(
            map(actions => { //console.log("actions",actions);
                // this.loadingInsurances.next(false);  	
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