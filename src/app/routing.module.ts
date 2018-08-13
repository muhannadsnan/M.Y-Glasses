import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { CategoriesComponent } from "./components/categories/categories.component";
import { ItemsComponent } from "./components/Items/items.component";
import { AdminComponent } from "./components/admin/admin.component";
import { AdminIndexComponent } from "./components/admin/admin-index/admin-index.component";
import { BranchesComponent } from "./components/Branches/branches.component";
import { InsurancesComponent } from "./components/insurances/insurances.component";
import { OrdersComponent } from "./components/orders/orders.component";
import { ClientsComponent } from "./components/clients/clients.component";
import { CategoryComponent } from "./components/categories/category/category.component";
import { EditCategoryComponent } from "./components/categories/edit-category/edit-category.component";
import { ItemComponent } from "./components/Items/item/item.component";

const routes = [
	{path: '', redirectTo: '/home', pathMatch: 'full'},
	{path: 'home', component: HomeComponent },	
	{path: 'home/:name', component: HomeComponent },	
	{path: 'categories', component: CategoriesComponent, /*canActivate: [AuthGuard],*/ children: [
			{path: ':catid', component: ItemsComponent}
		]
	},
	{path: 'items', component: ItemsComponent, data: {itemsInRow: 3}},
	{path: 'admin', component: AdminComponent, children: [
			{path: '', component: AdminIndexComponent},
			{path: 'categories', children: [
                {path: '', component: CategoriesComponent, data: {showAs: 'table'}},
                {path: ':id', component: CategoryComponent, data: {showAs: 'details', adminMode: 'detail-mode'}},
            ]},
			{path: 'items', children: [
                {path: '', component: ItemsComponent, data: {showAs: 'table'}},
                {path: ':id', component: ItemComponent, data: {showAs: 'details', adminMode: 'detail-mode'}},
            ]},
			{path: 'branches', component: BranchesComponent, data: {showAs: 'table'}},
			{path: 'insurances', component: InsurancesComponent, data: {showAs: 'table'}},
			{path: 'clients', component: ClientsComponent, data: {showAs: 'table'}},
			{path: 'orders', component: OrdersComponent, data: {showAs: 'table'}},
		]
	},
	{path: '**', component: HomeComponent, data: {message: 'Page not found', messageType: 'error'}}
];



@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class RoutingModule {

}