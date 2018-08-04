import { Component, OnInit, Input } from '@angular/core';
import { Insurance } from '../../../models/insurance';
import { InsuranceService } from '../../../services/insurance.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {
    @Input() insurance: Insurance;
    @Input() showAs: string;
    adminMode: string; // add, edit in modal
    isLoading: boolean;

    constructor(private insuranceService: InsuranceService,
                    private modalService: ModalService) { }

    ngOnInit() {
        this.insuranceService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add-mode')
                this.insurance = new Insurance();
        });       
        if(!this.showAs)
            this.showAs = 'list-group-insurance';
        this.insuranceService.selectedInsurance.subscribe(insurance => this.insurance = insurance);
    }

    
    onClickInsurance(){
        this.insuranceService.selectedInsurance.next(this.insurance);
    }
    
    switchAdminMode(mode){        
        this.insuranceService.adminMode.next(mode); console.log(this.adminMode);
    }
    
    saveChanges(){
        console.log("insurance", this.insurance);
        this.isLoading = true;
        this.insuranceService.updateInsurance(this.insurance).subscribe(resp => {
            console.log(resp);
            this.isLoading = false;
            this.insuranceService.adminMode.next('detail-mode');
        });
    }
    
    deleteInsurance(){
        if(confirm(`Delete insurance "${this.insurance.title}"?`)){
            this.isLoading = true;
            this.insuranceService.loadingInsurances.next(true);
            this.insuranceService.destroyInsurance(this.insurance.id).subscribe(resp => {
                console.log(resp);
                this.isLoading = false;
                this.modalService.showModal.next(false);
                this.insuranceService.loadingInsurances.next(false);
                this.insuranceService.insuranceDeleted.next(this.insurance);           
                this.insurance = new Insurance;
            });
        }
    }
}
