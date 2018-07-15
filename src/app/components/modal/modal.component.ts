import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  show: boolean = false;
  @Input() btns: string;
  tmp: Subscription;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
      this.btns = "close-only"; // close-only(defalut), close-save, ok-only, ok-cancel, yes-no, delete-cancel
      this.tmp = this.categoryService.showModal.subscribe(show => this.show = show);
  }

  closeModal(){
    this.categoryService.showModal.next(false);
  }

  ngOnDestroy(){
    this.tmp.unsubscribe();
  }

}
