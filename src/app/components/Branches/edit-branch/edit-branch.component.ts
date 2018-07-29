import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Branch } from '../../../models/branch';
import { BranchService } from '../../../services/branch.service';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-edit-branch',
  templateUrl: './edit-branch.component.html',
  styleUrls: ['./edit-branch.component.css']
})
export class EditBranchComponent implements OnInit, OnDestroy {
    @Input() branch: Branch; 
    tmp: Subscription;
    isLoading: boolean;
    isLoadingCats: boolean;
    categories;

    constructor(private branchService: BranchService, 
                    private categoryService: CategoryService,
                    private modalService: ModalService) { }

    ngOnInit() {
        this.isLoading = false;
        this.InitBranch();
        this.Listen_OnClickCreateBranch();
    }

    InitBranch(){
        if( ! this.branch ){ //console.log("this.branch has been initialized!");
            this.branch = new Branch
        }
    }

    Listen_OnClickCreateBranch(){
        this.tmp = this.branchService.ClickedBranchCreate.subscribe(isCreated => {
            if(isCreated){
                this.isLoading = true;
                this.Listen_CreateBranch();
            }
        });
    }

    Listen_CreateBranch(){
        this.branchService.createBranch(this.branch).subscribe(resp => {
            this.modalService.showModal.next(false);
            //toastr msg
            this.isLoading = false;
            this.branchService.loadingBranches.next(false);
            console.log("resp create branch", resp);
            this.branch.id = resp;
            this.branchService.branchCreated.next(this.branch);
            this.branch = new Branch;
        });
    }

    catSelected(cat){
        console.log(cat);
    }

    ngOnDestroy(){
        this.tmp.unsubscribe();
    }

}
