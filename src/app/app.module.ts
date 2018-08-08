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
import { BranchesComponent } from './components/Branches/branches.component';
import { BranchService } from './services/branch.service';
import { BranchComponent } from './components/Branches/branch/branch.component';
import { EditBranchComponent } from './components/Branches/edit-branch/edit-branch.component';
import { BranchAddItemComponent } from './components/Branches/edit-branch/branch-add-item/branch-add-item.component';
import { InsuranceService } from './services/insurance.service';
import { InsuranceComponent } from './components/insurances/insurance/insurance.component';
import { InsurancesComponent } from './components/insurances/insurances.component';
import { EditInsuranceComponent } from './components/insurances/edit-insurance/edit-insurance.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderComponent } from './components/orders/order/order.component';
import { EditOrderComponent } from './components/orders/edit-order/edit-order.component';
import { OrderService } from './services/order.service';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientComponent } from './components/clients/client/client.component';
import { EditClientComponent } from './components/clients/edit-client/edit-client.component';
import { ClientService } from './services/client.service';

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
        EditItemComponent,
        BranchesComponent,
        BranchComponent,
        EditBranchComponent,
        BranchAddItemComponent,
        InsurancesComponent,
        InsuranceComponent,
        EditInsuranceComponent,
        ClientsComponent,
        ClientComponent,
        EditClientComponent,
        OrdersComponent,
        OrderComponent,
        EditOrderComponent
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
    providers: [ModalService, CategoryService, ItemService, BranchService, InsuranceService, ClientService, OrderService],
    bootstrap: [AppComponent]
})
export class AppModule { }
