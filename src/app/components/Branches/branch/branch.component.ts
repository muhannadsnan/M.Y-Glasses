import { Component, OnInit, Input } from '@angular/core';
import { Branch } from '../../../models/branch';
import { BranchService } from '../../../services/branch.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {
    @Input() branch: Branch;
    @Input() showAs: string;
    adminMode: string; // add, edit in modal
    isLoading: boolean;

    constructor(private branchService: BranchService,
                    private modalService: ModalService) { }

    ngOnInit() {
        this.branchService.adminMode.subscribe(mode => {
            this.adminMode = mode;
            if(mode == 'add-mode')
                this.branch = new Branch();
        });       
        if(!this.showAs)
            this.showAs = 'list-group-branch';
        this.branchService.selectedBranch.subscribe(branch => this.branch = branch);
    }

    
    onClickBranch(){
        this.branchService.selectedBranch.next(this.branch);
    }
    
    switchAdminMode(mode){        
        this.branchService.adminMode.next(mode); console.log(this.adminMode);
    }
    
    saveChanges(){
        this.isLoading = true;
        this.branchService.updateBranch(this.branch).subscribe(resp => {
            console.log(resp);
            this.isLoading = false;
            this.branchService.adminMode.next('detail-mode');
        });
    }
    
    deleteBranch(){
        if(confirm(`Delete branch "${this.branch.title}"?`)){
            this.isLoading = true;
            this.branchService.loadingBranches.next(true);
            this.branchService.destroyBranch(this.branch.id).subscribe(resp => {
                console.log(resp);
                this.isLoading = false;
                this.modalService.showModal.next(false);
                this.branchService.loadingBranches.next(false);
                this.branchService.branchDeleted.next(this.branch);           
                this.branch = new Branch;
            });
        }
    }
}
