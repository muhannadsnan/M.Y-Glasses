import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RoutingModule } from './routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {SelectModule} from 'ng-select';

import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryComponent } from './components/categories/category/category.component';
import { ItemsComponent } from './components/Items/items.component';
import { ItemComponent } from './components/Items/item/item.component';

import { CategoryService } from './services/category.service';
import { ItemService } from './services/item.service';
import { AdminComponent } from './components/admin/admin.component';
import { AdminIndexComponent } from './components/admin/admin-index/admin-index.component';
import { ModalComponent } from './components/modal/modal.component';
import { EditCategoryComponent } from './components/categories/edit-category/edit-category.component';
import { EditItemComponent } from './components/items/edit-item/edit-item.component';
import { FormsModule } from '@angular/forms';
import { ModalService } from './services/modal.service';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        ModalComponent,
        HomeComponent,
        CategoriesComponent,
        CategoryComponent,        
        ItemsComponent,
        ItemComponent,
        AdminComponent,
        AdminIndexComponent,
        EditCategoryComponent,
        EditItemComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RoutingModule,
        HttpClientModule,
        HttpModule,
        NgbModule.forRoot(), // bootstrap 4
        SelectModule
    ],
    providers: [CategoryService, ItemService, ModalService],
    bootstrap: [AppComponent]
})
export class AppModule { }
