import { Component, OnInit } from '@angular/core';
import { InsuranceService } from '../../services/insurance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'insurances',
  templateUrl: './insurances.component.html',
  styleUrls: ['./insurances.component.css']
})

export class InsurancesComponent implements OnInit {
    insurances;
    selectedId = 0;
    loadingInsurances;
    showAs;
    // showModal;
    adminMode;

    constructor(private insuranceService: InsuranceService,
                private modalService: ModalService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() { //console.log("insurancesss");
        this.LISTEN_LoadingInsurances();
        this.LISTEN_CreateInsurance();
        this.LISTEN_DeleteInsurance();
        this.getInsurances();
        this.showAs = 'grid';
        this.LISTEN_Data();
        this.LISTEN_AdminMode();
    }

    insuranceChanged(insurance) {
        this.selectedId = insurance.id;
        this.insuranceService.selectedInsurance.next(insurance);
    }

    getInsurances(){
        this.insuranceService.loadingInsurances.next(true);
        this.insuranceService.readInsurances().subscribe(resp => { //console.log("resp", resp);
            if(typeof resp === "undefined"){
                this.insurances = [];
            }else{
                this.insurances = resp;
            }
            this.insuranceService.loadingInsurances.next(false);
        });
    }

    LISTEN_LoadingInsurances(){
        this.insuranceService.loadingInsurances.subscribe(isLoading => this.loadingInsurances = isLoading);
    }

    LISTEN_CreateInsurance(){
        this.insuranceService.insuranceCreated.subscribe(createdInsurance => {
            this.insurances.unshift(createdInsurance);
        });
    }
    
    LISTEN_DeleteInsurance(){
        this.insuranceService.insuranceDeleted.subscribe(deletedInsurance => { 
            this.insurances = this.insurances.filter(insurance => insurance !== deletedInsurance);
        });
    }

    LISTEN_Data(){
        this.route.data.subscribe(data => { //console.log("showAs", this.showAs);
            if(data.showAs){
            this.showAs = data.showAs; console.log("data ", data);
            }
        });
    }

    LISTEN_AdminMode(){
        this.insuranceService.adminMode.subscribe(mode => this.adminMode = mode);
    }

    onClkInsurance(insurance){
        this.modalService.showModal.next(true);
        this.insuranceService.adminMode.next('detail-mode');
        this.insuranceChanged(insurance);
    }

    onClkAddInsurance(){
        this.modalService.showModal.next(true);
        this.insuranceService.adminMode.next('add-mode');
    }

    onCreateInsurance(){
        this.insuranceService.ClickedInsuranceCreate.next(true);
        this.insuranceService.loadingInsurances.next(true);
    }
}