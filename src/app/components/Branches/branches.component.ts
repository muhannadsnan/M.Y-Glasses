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

    constructor(private insuranceService: BranchService,
                private modalService: ModalService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() { //console.log("catsss");
        this.LISTEN_LoadingBranches();
        this.LISTEN_CreateBranches();
        this.LISTEN_DeleteBranches();
        this.getBranches();
        this.showAs = 'grid';
        this.LISTEN_Data();
        this.LISTEN_AdminMode_catService();
    }

    catChanged(cat) { //console.log("cat clicked",cat);
        this.selectedId = cat.id;
        this.insuranceService.selectedBranch.next(cat);
    }

    getBranches(){
        this.insuranceService.loadingBranches.next(true);
        this.tmp[0] = this.insuranceService.readBranches().subscribe(resp => { //console.log("resp", resp);
            if(typeof resp === "undefined"){
                this.branches = [];
            }else{
                this.branches = resp;
            }            
            this.insuranceService.loadingBranches.next(false);
        });
    }

    LISTEN_LoadingBranches(){
        this.tmp[1] = this.insuranceService.loadingBranches.subscribe(isLoading => this.loadingBranches = isLoading);
    }

    LISTEN_CreateBranches(){
        this.tmp[2] = this.insuranceService.insuranceCreated.subscribe(createdBranch => {
            this.branches.unshift(createdBranch);
        });
    }
    
    LISTEN_DeleteBranches(){
        this.tmp[3] = this.insuranceService.insuranceDeleted.subscribe(deletedBranch => { 
            this.branches = this.branches.filter(cat => cat !== deletedBranch);
        });
    }

    LISTEN_Data(){
        this.tmp[4] = this.route.data.subscribe(data => { //console.log("showAs", this.showAs);
            if(data.showAs){
                this.showAs = data.showAs; //console.log("data ", data);
            }
        });
    }

    LISTEN_AdminMode_catService(){
        this.tmp[5] = this.insuranceService.adminMode.subscribe(mode => this.adminMode = mode);
    }

    onClkBranch(branch){
        this.modalService.showModal.next(true);
        this.insuranceService.adminMode.next('detail-mode');
        this.catChanged(branch);
    }

    onClkAddBranch(){
        this.modalService.showModal.next(true);
        this.insuranceService.adminMode.next('add-mode');
    }

    ngOnDestroy(){
        this.tmp.forEach( el => el.unsubscribe() );
    }
}
