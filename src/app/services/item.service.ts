import { Product } from "../models/product";
import { Observable } from "rxjs";
import { AngularFireList, AngularFireDatabase } from "angularfire2/database";
import { map } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { Injectable } from "@angular/core";
import { AngularFirestoreCollection, AngularFirestore } from "angularfire2/firestore";

@Injectable()

export class ItemService {

	itemCollection: AngularFirestoreCollection<any>;

	constructor(private firestore: AngularFirestore){
		//this.prodCollection = firestore.collection('');
	}

	updateProduct(newProd){console.log(newProd.id);
		this.firestore.doc('products/' + newProd.id).update(Object.assign({}, newProd));
	}

	MAP(observable: Observable<any[]>) {
		return observable.pipe(
			map(actions => {
				return actions.map(a => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;
					return { id, ...data };
				})
			})
		)
	}
}