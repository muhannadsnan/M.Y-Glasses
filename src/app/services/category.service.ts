import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Category } from "../models/category";

@Injectable()

export class CategoryService {
	catCollection: AngularFirestoreCollection<any>;
	selectedCategory: Subject<any> = new Subject<any>(); 
	
	prodCollection: AngularFirestoreCollection<any>;

	loadingCats: Subject<boolean> = new Subject<boolean>(); 
	loadingProds: Subject<boolean> = new Subject<boolean>(); 

	isLoggedin = false;

	constructor(private firestore: AngularFirestore){
		this.catCollection = this.firestore.collection('categories');
		this.prodCollection = this.firestore.collection('products');
	}

	readCats() {
		//return this.firestore.collection('categories').valueChanges(); // without maping IDs
		this.loadingCats.next(true);
		return this.MAP(this.catCollection.snapshotChanges());
	}

	createCat(newCat){
		return this.catCollection.add(newCat);
	}

	destroyCat(catid){
		this.catCollection.doc(catid).delete()
			.then(_ => console.log("Document successfully deleted!"))
			.catch(error => console.error("Error removing document: ", error))
	}

	readProdsByCatId(catid) {
		this.loadingProds.next(true);		
		return this.MAP(this.firestore.collection('products', ref => ref.where('catid', '==', catid)).snapshotChanges());
	}

	readAllProducts(){
		return this.MAP(this.prodCollection.snapshotChanges());
	}
	
	
	
	MAP(observable: Observable<any[]>){
		return observable.pipe(
			map(actions => {
				this.loadingCats.next(false);
				this.loadingProds.next(false);	
				return actions.map(a => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;									
					return { id, ...data };
				})
			})
		);
	}
}