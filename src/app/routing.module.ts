import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { CategoriesComponent } from "./components/categories/categories.component";
import { ItemsComponent } from "./components/items/items.component";
import { ItemComponent } from "./components/items/item/item.component";
import { AdminComponent } from "./components/admin/admin.component";
import { AdminIndexComponent } from "./components/admin/admin-index/admin-index.component";
import { BranchesComponent } from "./components/branches/branches.component";
import { BranchComponent } from "./components/branches/branch/branch.component";
import { InsurancesComponent } from "./components/insurances/insurances.component";
import { OrdersComponent } from "./components/orders/orders.component";
import { ClientsComponent } from "./components/clients/clients.component";
import { CategoryComponent } from "./components/categories/category/category.component";
import { InsuranceComponent } from "./components/insurances/insurance/insurance.component";
import { ClientComponent } from "./components/clients/client/client.component";
import { OrderComponent } from "./components/orders/order/order.component";
import { AuthGuard } from "./services/auth.guard";
import { LoginComponent } from "./components/auth/login/login.component";

const routes = [
	{path: '', redirectTo: '/home', pathMatch: 'full'},
	{path: 'home', component: HomeComponent },	
	{path: 'home/:name', component: HomeComponent },	
	{path: 'categories', component: CategoriesComponent, canActivate: [/* AuthGuard */], children: [
			{path: ':catid', component: ItemsComponent}
		]
    },
    {path: 'items', data: {itemsInRow: 3}, children: [
        {path: '', component: ItemsComponent},
        {path: ':id', component: ItemComponent, data: {showAs: "card"}},
    ]},
	{path: 'admin', canActivate: [AuthGuard], children: [
			{path: '', component: AdminIndexComponent},
			{path: 'categories', children: [
                {path: '', component: CategoriesComponent, data: {showAs: 'table'}},
                {path: ':id', component: CategoryComponent, data: {showAs: 'details', adminMode: 'detail-mode'}},
            ]},
			{path: 'items', children: [
                {path: '', component: ItemsComponent, data: {showAs: 'table'}},
                {path: ':id', component: ItemComponent, data: {showAs: 'details', adminMode: 'detail-mode'}},
            ]},
			{path: 'branches', children: [
                {path: '', component: BranchesComponent, data: {showAs: 'table'}},
                {path: ':id', component: BranchComponent, data: {showAs: 'details', adminMode: 'detail-mode'}},
            ]},
			{path: 'insurances', children: [
                {path: '', component: InsurancesComponent, data: {showAs: 'table'}},
                {path: ':id', component: InsuranceComponent, data: {showAs: 'details', adminMode: 'detail-mode'}},
            ]},
			{path: 'clients', children: [
                {path: '', component: ClientsComponent, data: {showAs: 'table'}},
                {path: ':id', component: ClientComponent, data: {showAs: 'details', adminMode: 'detail-mode'}},
            ]},
			{path: 'orders', children: [
                {path: '', component: OrdersComponent, data: {showAs: 'table'}},
                {path: ':id', component: OrderComponent, data: {showAs: 'details', adminMode: 'detail-mode'}},
            ]},
		]
    },
    {path: 'login', component: LoginComponent},
	{path: '**', redirectTo: "/home?err=Page not found!"}
];



@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class RoutingModule {

}