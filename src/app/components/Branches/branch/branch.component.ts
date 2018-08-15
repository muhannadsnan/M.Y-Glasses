import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Branch } from '../../../models/branch';
import { BranchService } from '../../../services/branch.service';
import { ModalService } from '../../../services/modal.service';
import { Subscription } from '../../../../../node_modules/rxjs';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit, OnDestroy {
    @Input() branch: Branch;
    @Input() showAs: string;
    adminMode: string; // add, edit in modal
    isLoading: boolean = false;
    tmp: Subscription[] = [];

    constructor(private insuranceService: BranchService,
                    private modalService: ModalService,
                    private route: ActivatedRoute,
                    private router: Router) { }

    ngOnInit() { // order is important here        
        this.LISTEN_AdminMode();
        this.INIT_Data();
        this.LISTEN_Params();
        this.tmp[1] = this.insuranceService.selectedBranch.subscribe(branch => this.branch = branch);
        if(typeof this.branch == 'undefined' && this.showAs != 'table') {// means we will request the branch
            this.LOADING(true);
        }
        if( !this.showAs)
            this.showAs = 'list-group-branch';
    }

    LISTEN_AdminMode(){
        this.tmp[0] = this.insuranceService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add-mode')
                this.branch = new Branch();
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
                this.tmp[6] = this.insuranceService.getBranchById(params.id).subscribe(branch =>{ console.log("branch", branch)
                    if(typeof branch == "undefined" || branch === null){
                        alert("The object you are trying to reach is not available!");
                    }else{
                        this.branch = branch;
                        this.branch.id = params.id;
                        this.LOADING(false);
                    }
                });
            }
        });
    }

    onClickBranch(){
        this.insuranceService.selectedBranch.next(this.branch);
    }

    switchAdminMode(mode){        
        this.insuranceService.adminMode.next(mode); console.log(this.adminMode);
    }

    navigateByAdminMode(mode){
        let navigateUrl = [];
        if(mode == "edit-mode")
            navigateUrl = ['admin', 'insurances', this.branch.id, 'edit'];
        else if(mode == "detail-mode")
            navigateUrl = ['admin', 'insurances', this.branch.id];
        this.router.navigate(navigateUrl);
    }

    deleteBranch(){
        if(confirm(`Delete branch "${this.branch.title}"?`)){
            this.LOADING(true);
            this.insuranceService.loadingBranches.next(true);
            this.tmp[3] = this.insuranceService.destroyBranch(this.branch.id).subscribe(resp => {
                console.log(resp);
                this.LOADING(false);
                this.modalService.showModal.next(false);
                this.insuranceService.loadingBranches.next(false);
                this.insuranceService.insuranceDeleted.next(this.branch);           
                this.branch = new Branch;
            });
        }
    }

    navTo(url){
        this.router.navigateByUrl(url);
    }

    LOADING(value){
        this.isLoading = value;
        this.modalService.isLoading.next(value);
    }

    ngOnDestroy(){
        this.tmp.forEach( el => el.unsubscribe() );
    }
}
