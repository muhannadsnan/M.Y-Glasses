import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Branch } from '../../../models/branch';
import { BranchService } from '../../../services/branch.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-edit-branch',
  templateUrl: './edit-branch.component.html',
  styleUrls: ['./edit-branch.component.css']
})
export class EditBranchComponent implements OnInit, OnDestroy {
    @Input() branch: Branch; 
    adminMode;
    isLoading: boolean;
    tmp: Subscription[] = [];

    constructor(private branchService: BranchService,
                    private categoryService: CategoryService,
                    private modalService: ModalService,
                    private route: ActivatedRoute) { }

    ngOnInit() {
        this.LOADING(false);
        this.LISTEN_AdminMode();
        this.InitBranch();
    }

    InitBranch(){
        if( ! this.branch ){ //console.log("this.branch has been initialized!");
            this.branch = new Branch
            this.adminMode = "add-mode"
        }else this.adminMode = "edit-mode"
    }

    INIT_Data(){
        this.tmp[4] = this.route.data.subscribe(data => {
            if(data.adminMode)
                this.branchService.adminMode.next(data.adminMode);
        } ); 
    }

    LISTEN_AdminMode(){
        this.tmp[0] = this.branchService.adminMode.subscribe(mode => { console.log(mode);
            this.adminMode = mode;
            if(mode == 'add-mode') // to reset after edit-mode
                this.branch = new Branch();
        });
    }

    onCreateBranch(){
        this.LOADING(true);
        this.tmp[2] = this.branchService.createBranch(this.branch).subscribe(resp => {
            this.modalService.showModal.next(false);
            //toastr msg
            this.LOADING(false);
            this.branchService.loadingBranches.next(false);
            console.log("resp create branch", resp);
            this.branch.id = resp;
            this.branchService.branchCreated.next(this.branch);
            this.branch = new Branch;
        });
    }

    switchAdminMode(mode){        
        this.branchService.adminMode.next(mode); console.log(this.adminMode);
    }

    saveChanges(){
        this.LOADING(true);
        this.tmp[2] = this.branchService.updateBranch(this.branch).subscribe(resp => { console.log(resp);
            this.LOADING(false);
            this.branchService.adminMode.next('detail-mode');
        });
    }

    LOADING(value){
        this.isLoading = value;
        this.modalService.isLoading.next(value);
    }

    ngOnDestroy(){
        this.tmp.forEach( subs => subs.unsubscribe() );
    }

}
