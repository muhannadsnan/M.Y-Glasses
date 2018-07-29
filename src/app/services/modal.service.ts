import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()

export class ModalService {
    showModal: Subject<boolean> = new Subject<boolean>();
    isLoading: Subject<boolean> = new Subject<boolean>(); 
    
    constructor(){}
}