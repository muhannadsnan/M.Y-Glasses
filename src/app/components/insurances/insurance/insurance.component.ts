import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Insurance } from '../../../models/insurance';
import { InsuranceService } from '../../../services/insurance.service';
import { ModalService } from '../../../services/modal.service';
import { Subscription } from '../../../../../node_modules/rxjs';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit, OnDestroy {
    @Input() insurance: Insurance;
    @Input() showAs: string;
    adminMode: string; // add, edit in modal
    isLoading: boolean = false;
    tmp: Subscription[] = [];

    constructor(private insuranceService: InsuranceService,
                    private modalService: ModalService,
                    private route: ActivatedRoute,
                    private router: Router) { }

    ngOnInit() { // order is important here        
        this.LISTEN_AdminMode();
        this.INIT_Data();
        this.LISTEN_Params();
        this.tmp[1] = this.insuranceService.selectedInsurance.subscribe(insurance => this.insurance = insurance);
        if(typeof this.insurance == 'undefined' && this.showAs != 'table') {// means we will request the insurance
            this.LOADING(true);
        }
        if( !this.showAs)
            this.showAs = 'list-group-insurance';
    }

    LISTEN_AdminMode(){
        this.tmp[0] = this.insuranceService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add-mode')
                this.insurance = new Insurance();
        });
    }

    INIT_Data(){
        this.tmp[4] = this.route.data.subscribe(data => {
            this.showAs = data.showAs;
            if(data.adminMode)
                this.insuranceService.adminMode.next(data.adminMode);
        } ); 
    }

    LISTEN_Params(){
        this.tmp[5] = this.route.params.subscribe(params => { //console.log("params", params);
            if(this.showAs == "details" && (this.adminMode == "edit-mode" || this.adminMode == "detail-mode")){ // so dont request in /admin/insurances when showAs table
                this.tmp[6] = this.insuranceService.getInsuranceById(params.id).subscribe(insurance =>{ console.log("insurance", insurance)
                    if(typeof insurance == "undefined" || insurance === null){
                        alert("The object you are trying to reach is not available!");
                    }else{
                        this.insurance = insurance;
                        this.insurance.id = params.id;
                        this.LOADING(false);
                    }
                });
            }
        });
    }

    onClickInsurance(){
        this.insuranceService.selectedInsurance.next(this.insurance);
    }

    switchAdminMode(mode){        
        this.insuranceService.adminMode.next(mode); console.log(this.adminMode);
    }

    navigateByAdminMode(mode){
        let navigateUrl = [];
        if(mode == "edit-mode")
            navigateUrl = ['admin', 'insurances', this.insurance.id, 'edit'];
        else if(mode == "detail-mode")
            navigateUrl = ['admin', 'insurances', this.insurance.id];
        this.router.navigate(navigateUrl);
    }

    navTo(url){
        this.router.navigateByUrl(url);
    }

    deleteInsurance(){
        if(confirm(`Delete insurance "${this.insurance.title}"?`)){
            this.LOADING(true);
            this.insuranceService.loadingInsurances.next(true);
            this.tmp[3] = this.insuranceService.destroyInsurance(this.insurance.id).subscribe(resp => {
                console.log(resp);
                this.LOADING(false);
                this.modalService.showModal.next(false);
                this.insuranceService.loadingInsurances.next(false);
                this.insuranceService.insuranceDeleted.next(this.insurance);           
                this.insurance = new Insurance;
                this.router.navigateByUrl("/admin/insurances");
            });
        }
    }

    LOADING(value){
        this.isLoading = value;
        this.modalService.isLoading.next(value);
    }

    ngOnDestroy(){
        this.tmp.forEach( subs => subs.unsubscribe() );
    }
}
