import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap, catchError } from 'rxjs/operators';
import { throwError } from "rxjs";

@Injectable()

export class DbService {

	constructor(private http: HttpClient){}

	createOBJ(obj){
		return this.http.post('https://test-firebase-597da.firebaseio.com/test.json', obj)
		.pipe(
			tap(console.log)
		);
	}

	readData(){
		return this.http.get('https://test-firebase-597da.firebaseio.com/test.json')
						.pipe(
							//map(res => res),
							tap(console.log),
							catchError(_ => throwError("MyERROR : Error while reading data, Muhannad!"))
						);
	}
}