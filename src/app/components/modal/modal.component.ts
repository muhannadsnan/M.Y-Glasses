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
  tmp1: Subscription;
  tmp2: Subscription;
  tmp3: Subscription;

  constructor(private modalService: ModalService,
                    private itemService: ItemService,
                    private categoryService: CategoryService) { }

  ngOnInit() {
      this.btns = "close-only"; // close-only(defalut), close-save, ok-only, ok-cancel, yes-no, delete-cancel

      this.tmp1 = this.modalService.showModal.subscribe(show => this.show = show);
      this.tmp2 = this.itemService.adminMode.subscribe(mode => this.adminMode = mode);
      this.tmp3 = this.categoryService.adminMode.subscribe(mode => this.adminMode = mode);
  }

  closeModal(){
    this.modalService.showModal.next(false);
    this.itemService.adminMode.next('');
    this.categoryService.adminMode.next('');
  }

  ngOnDestroy(){
    this.tmp1.unsubscribe();
    this.tmp2.unsubscribe();
    this.tmp3.unsubscribe();
  }

}
