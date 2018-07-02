import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { CategoriesComponent } from "./components/categories/categories.component";
import { CategoryComponent } from "./components/categories/category/category.component";
import { AuthGuard } from "./services/auth.guard";
import { ItemsComponent } from "./components/Items/items.component";

const routes = [
	{path: '', redirectTo: '/home', pathMatch: 'full'},
	{ path: 'home', component: HomeComponent },	
	{ path: 'home/:name', component: HomeComponent },	
	{path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard], children: [
			{path: ':catid', component: ItemsComponent}
		]
	},
	{ path: 'products', component: ItemsComponent, data: {show: 3}}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class RoutingModule {

}