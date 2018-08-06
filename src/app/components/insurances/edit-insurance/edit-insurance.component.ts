import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Insurance } from '../../../models/insurance';
import { InsuranceService } from '../../../services/insurance.service';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-edit-insurance',
  templateUrl: './edit-insurance.component.html',
  styleUrls: ['./edit-insurance.component.css']
})
export class EditInsuranceComponent implements OnInit, OnDestroy {
    @Input() insurance: Insurance; 
    tmp: Subscription;
    isLoading: boolean;
    isLoadingCats: boolean;
    categories;

    constructor(private insuranceService: InsuranceService, 
                    private categoryService: CategoryService,
                    private modalService: ModalService) { }

    ngOnInit() {
        this.isLoading = false;
        this.InitInsurance();
        this.Listen_OnClickCreateInsurance();
        this.readCategories();
    }

    InitInsurance(){
        if( ! this.insurance ){ //console.log("this.insurance has been initialized!");
            this.insurance = new Insurance
        }
    }

    Listen_OnClickCreateInsurance(){
        this.tmp = this.insuranceService.ClickedInsuranceCreate.subscribe(isCreated => {
            if(isCreated){
                this.isLoading = true;
                this.Listen_CreateInsurance();
            }
        });
    }

    Listen_CreateInsurance(){
        this.insuranceService.createInsurance(this.insurance).subscribe(resp => {
            this.modalService.showModal.next(false);
            //toastr msg
            this.isLoading = false;
            this.insuranceService.loadingInsurances.next(false);
            console.log("resp create insurance", resp);
            this.insurance.id = resp;
            this.insuranceService.insuranceCreated.next(this.insurance);
            this.insurance = new Insurance;
        });
    }

    readCategories(){
        this.isLoadingCats = true;
        this.categoryService.MAP_List_Value_label(this.categoryService.readCats())
        .subscribe(resp => { //console.log("read cats", resp);
            if(typeof resp === "undefined"){
                this.categories = [];
            }else{
                this.categories = resp; 
            }     
            this.isLoadingCats = false;
        });
    }

    ngOnDestroy(){
        this.tmp.unsubscribe();
    }

}
