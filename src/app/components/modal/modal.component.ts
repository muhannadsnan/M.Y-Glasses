import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
    show: boolean = false;
    adminMode;
    @Input() btns: string;
    isLoading = false;
    tmp: Subscription[] = [];

    constructor(private modalService: ModalService,
                    private itemService: ItemService,
                    private categoryService: CategoryService) { }

    ngOnInit() {
        this.btns = "no-btns"; // close-only(defalut), close-save, ok-only, ok-cancel, yes-no, delete-cancel
        this.tmp[0] = this.modalService.showModal.subscribe(show => this.show = show);
        this.tmp[1] = this.itemService.adminMode.subscribe(mode => this.adminMode = mode);
        this.tmp[2] = this.categoryService.adminMode.subscribe(mode => this.adminMode = mode);
        this.LISTEN_IsLoading();
    }

    closeModal(){
        this.modalService.showModal.next(false);
        this.itemService.adminMode.next('');
        this.categoryService.adminMode.next('');
    }

    LISTEN_IsLoading(){
        this.tmp[3] = this.modalService.isLoading.subscribe(value => this.isLoading = value);
    }

    ngOnDestroy(){
        this.tmp.forEach( el => el.unsubscribe() );
    }

}
