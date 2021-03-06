import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BranchService } from '../../services/branch.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})

export class BranchesComponent implements OnInit, OnDestroy {
    branches;
    selectedId = 0;
    loadingBranches;
    showAs;
    adminMode;
    tmp: Subscription[] = [];

    constructor(private branchService: BranchService,
                private modalService: ModalService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() { //console.log("branchsss");
        this.LISTEN_LoadingBranches();
        this.LISTEN_CreateBranch();
        this.LISTEN_DeleteBranch();
        this.getBranches();
        this.showAs = 'grid';
        this.LISTEN_Data();
        this.LISTEN_AdminMode_branchService();
    }

    branchChanged(branch) { //console.log("branch clicked",branch);
        this.selectedId = branch.id;
        this.branchService.selectedBranch.next(branch);
    }

    getBranches(){
        this.branchService.loadingBranches.next(true);
        this.tmp[0] = this.branchService.readBranches().subscribe(resp => { //console.log("resp", resp);
            if(typeof resp === "undefined"){
                this.branches = [];
            }else{
                this.branches = resp;
            }            
            this.branchService.loadingBranches.next(false);
        });
    }

    LISTEN_LoadingBranches(){
        this.tmp[1] = this.branchService.loadingBranches.subscribe(isLoading => this.loadingBranches = isLoading);
    }

    LISTEN_CreateBranch(){
        this.tmp[2] = this.branchService.branchCreated.subscribe(createdBranch => {
            this.branches.unshift(createdBranch);
        });
    }
    
    LISTEN_DeleteBranch(){
        this.tmp[3] = this.branchService.branchDeleted.subscribe(deletedBranch => { 
            this.branches = this.branches.filter(branch => branch !== deletedBranch);
        });
    }

    LISTEN_Data(){
        this.tmp[4] = this.route.data.subscribe(data => { //console.log("showAs", this.showAs);
            if(data.showAs){
                this.showAs = data.showAs; //console.log("data ", data);
            }
        });
    }

    LISTEN_AdminMode_branchService(){
        this.tmp[5] = this.branchService.adminMode.subscribe(mode => this.adminMode = mode);
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

    ngOnDestroy(){
        
        
    }
}
