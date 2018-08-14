import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { InsuranceService } from '../../services/insurance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-insurances',
  templateUrl: './insurances.component.html',
  styleUrls: ['./insurances.component.css']
})

export class InsurancesComponent implements OnInit, OnDestroy {
    insurances;
    selectedId = 0;
    loadingInsurances;
    showAs;
    adminMode;
    tmp: Subscription[] = [];

    constructor(private insuranceService: InsuranceService,
                private modalService: ModalService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() { //console.log("catsss");
        this.LISTEN_LoadingInsurances();
        this.LISTEN_CreateInsurances();
        this.LISTEN_DeleteInsurances();
        this.getInsurances();
        this.showAs = 'grid';
        this.LISTEN_Data();
        this.LISTEN_AdminMode_catService();
    }

    catChanged(cat) { //console.log("cat clicked",cat);
        this.selectedId = cat.id;
        this.insuranceService.selectedInsurance.next(cat);
    }

    getInsurances(){
        this.insuranceService.loadingInsurances.next(true);
        this.tmp[0] = this.insuranceService.readInsurances().subscribe(resp => { //console.log("resp", resp);
            if(typeof resp === "undefined"){
                this.insurances = [];
            }else{
                this.insurances = resp;
            }            
            this.insuranceService.loadingInsurances.next(false);
        });
    }

    LISTEN_LoadingInsurances(){
        this.tmp[1] = this.insuranceService.loadingInsurances.subscribe(isLoading => this.loadingInsurances = isLoading);
    }

    LISTEN_CreateInsurances(){
        this.tmp[2] = this.insuranceService.insuranceCreated.subscribe(createdInsurance => {
            this.insurances.unshift(createdInsurance);
        });
    }
    
    LISTEN_DeleteInsurances(){
        this.tmp[3] = this.insuranceService.insuranceDeleted.subscribe(deletedInsurance => { 
            this.insurances = this.insurances.filter(cat => cat !== deletedInsurance);
        });
    }

    LISTEN_Data(){
        this.tmp[4] = this.route.data.subscribe(data => { //console.log("showAs", this.showAs);
            if(data.showAs){
                this.showAs = data.showAs; //console.log("data ", data);
            }
        });
    }

    LISTEN_AdminMode_catService(){
        this.tmp[5] = this.insuranceService.adminMode.subscribe(mode => this.adminMode = mode);
    }

    onClkInsurance(insurance){
        this.modalService.showModal.next(true);
        this.insuranceService.adminMode.next('detail-mode');
        this.catChanged(insurance);
    }

    onClkAddInsurance(){
        this.modalService.showModal.next(true);
        this.insuranceService.adminMode.next('add-mode');
    }

    ngOnDestroy(){
        this.tmp.forEach( el => el.unsubscribe() );
    }
}
