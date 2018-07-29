import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../services/branch.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})

export class BranchesComponent implements OnInit {
    branches;
    selectedId = 0;
    loadingBranches;
    showAs;
    // showModal;
    adminMode;

    constructor(private branchService: BranchService,
                private modalService: ModalService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() { //console.log("branchesss");
        this.LISTEN_LoadingBranches();
        this.LISTEN_CreateBranch();
        this.LISTEN_DeleteBranch();
        this.getBranches();
        this.showAs = 'grid';
        this.LISTEN_Data();
        this.LISTEN_AdminMode();
    }

    branchChanged(branch) {
        this.selectedId = branch.id;
        this.branchService.selectedBranch.next(branch);
    }

    getBranches(){
        this.branchService.loadingBranches.next(true);
        this.branchService.readBranches().subscribe(resp => { //console.log("resp", resp);
            if(typeof resp === "undefined"){
                this.branches = [];
            }else{
                this.branches = resp;
            }
            this.branchService.loadingBranches.next(false);
        });
    }

    LISTEN_LoadingBranches(){
        this.branchService.loadingBranches.subscribe(isLoading => this.loadingBranches = isLoading);
    }

    LISTEN_CreateBranch(){
        this.branchService.branchCreated.subscribe(createdBranch => {
            this.branches.unshift(createdBranch); console.log("branches", this.branches);
        });
    }
    
    LISTEN_DeleteBranch(){
        this.branchService.branchDeleted.subscribe(deletedBranch => { 
            this.branches = this.branches.filter(branch => branch !== deletedBranch);
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
        this.branchService.adminMode.subscribe(mode => this.adminMode = mode);
    }

    onClkBranch(branch){
        this.modalService.showModal.next(true);
        this.branchService.adminMode.next('detail-mode');
        this.branchChanged(branch);
    }

    onClkAddBranch(){
        this.modalService.showModal.next(true);
        this.branchService.adminMode.next('add-mode');
    }

    onCreateBranch(){
        this.branchService.ClickedBranchCreate.next(true);
        this.branchService.loadingBranches.next(true);
    }
}