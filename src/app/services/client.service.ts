import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Client } from "../models/client";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()

export class ClientService {
	selectedClient: Subject<any> = new Subject<any>(); 
	ClickedClientCreate: Subject<any> = new Subject<any>(); 
	clientCreated: Subject<Client> = new Subject<Client>(); 
	clientDeleted: Subject<Client> = new Subject<Client>(); 
	loadingClients: Subject<boolean> = new Subject<boolean>();

	showModal: Subject<boolean> = new Subject<boolean>();
    adminMode: Subject<string> = new Subject<string>();
	isLoggedin = false;
    dbUrl = environment.db.url;

    constructor(private http: HttpClient){}

    //********  CRUD FUNCTIONALITY  *********/
	readClients() {
        return this.MAP(this.http.get(`${this.dbUrl}/clients`));
	}

	createClient(newClient: Client): Observable<any>{
        return this.http.post(`${this.dbUrl}/clients`, newClient, { responseType: 'text' /*important to receive JSON*/});
    }
    
    updateClient(newClient: Client){
        return this.http.put(`${this.dbUrl}/clients/${newClient.id}`, new Client(null, newClient.name, newClient.phone, newClient.address, newClient.email), { responseType: 'text' /*important to receive JSON*/});        
	}

	destroyClient(clientid){
        return this.http.delete(`${this.dbUrl}/clients/${clientid}`, { responseType: 'text' /*important to receive JSON*/});
	}
    //*************************************
        
    searchClientByName(keyword){
        this.loadingClients.next(true);
        return this.MAP_List_Value_label(this.http.get(`${this.dbUrl}/clients/search/${keyword}`));
    }

	MAP(observable){
		return observable.pipe(
            map(actions => { //console.log("actions",actions);
                // this.loadingClients.next(false);  	
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
                    return res.map(row =>{ //console.log("res",res); console.log("row", row);
                        return { "value": row[0], "label": row[1].name };
                    } );
                }
            })
        );
    }
}