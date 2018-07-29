import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { CategoriesComponent } from "./components/categories/categories.component";
import { CategoryComponent } from "./components/categories/category/category.component";
import { AuthGuard } from "./services/auth.guard";
import { ItemsComponent } from "./components/Items/items.component";
import { AdminComponent } from "./components/admin/admin.component";
import { AdminIndexComponent } from "./components/admin/admin-index/admin-index.component";
import { BranchesComponent } from "./components/Branches/branches.component";

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
			{path: 'categories', component: CategoriesComponent, data: {showAs: 'table'}},
			{path: 'items', component: ItemsComponent, data: {showAs: 'table'}},
			{path: 'branches', component: BranchesComponent, data: {showAs: 'table'}},
		]
	},
	{path: '**', redirectTo: '/home', pathMatch: 'full', data: {message: 'Page not found', messageType: 'error'}}
];



@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class RoutingModule {

}