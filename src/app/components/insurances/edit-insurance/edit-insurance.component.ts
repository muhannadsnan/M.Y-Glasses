import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Insurance } from '../../../models/insurance';
import { InsuranceService } from '../../../services/insurance.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-edit-insurance',
  templateUrl: './edit-insurance.component.html',
  styleUrls: ['./edit-insurance.component.css']
})
export class EditInsuranceComponent implements OnInit, OnDestroy {
    @Input() insurance: Insurance; 
    adminMode;
    isLoading: boolean;
    isLoadingCats: boolean;
    tmp: Subscription[] = [];

    constructor(private insuranceService: InsuranceService,
                    private categoryService: CategoryService,
                    private modalService: ModalService,
                    private route: ActivatedRoute) { }

    ngOnInit() {
        this.LOADING(false);
        this.LISTEN_AdminMode();
        this.InitInsurance();
    }

    InitInsurance(){
        if( ! this.insurance ){ //console.log("this.insurance has been initialized!");
            this.insurance = new Insurance
            this.adminMode = "add-mode"
        }else this.adminMode = "edit-mode"
    }

    INIT_Data(){
        this.tmp[4] = this.route.data.subscribe(data => {
            if(data.adminMode)
                this.insuranceService.adminMode.next(data.adminMode);
        } ); 
    }

    LISTEN_AdminMode(){
        this.tmp[0] = this.insuranceService.adminMode.subscribe(mode => { console.log(mode);
            this.adminMode = mode;
            if(mode == 'add-mode') // to reset after edit-mode
                this.insurance = new Insurance();
        });
    }

    onCreateInsurance(){
        this.LOADING(true);
        this.tmp[2] = this.insuranceService.createInsurance(this.insurance).subscribe(resp => {
            this.modalService.showModal.next(false);
            //toastr msg
            this.LOADING(false);
            this.insuranceService.loadingInsurances.next(false);
            console.log("resp create insurance", resp);
            this.insurance.id = resp;
            this.insuranceService.insuranceCreated.next(this.insurance);
            this.insurance = new Insurance;
        });
    }

    switchAdminMode(mode){        
        this.insuranceService.adminMode.next(mode); console.log(this.adminMode);
    }

    saveChanges(){
        this.LOADING(true);
        this.tmp[2] = this.insuranceService.updateInsurance(this.insurance).subscribe(resp => { console.log(resp);
            this.LOADING(false);
            this.insuranceService.adminMode.next('detail-mode');
        });
    }

    LOADING(value){
        this.isLoading = value;
        this.modalService.isLoading.next(value);
    }

    ngOnDestroy(){
        this.tmp.forEach( el => el.unsubscribe() );
    }

}
