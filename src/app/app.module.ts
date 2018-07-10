import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RoutingModule } from './routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryComponent } from './components/categories/category/category.component';
import { ItemsComponent } from './components/Items/items.component';
import { ItemComponent } from './components/Items/item/item.component';

import { CategoryService } from './services/category.service';
import { ItemService } from './services/item.service';
import { DbService } from './services/DB.service';
import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { AdminComponent } from './components/admin/admin.component';
import { AdminIndexComponent } from './components/admin/admin-index/admin-index.component';
import { ModalComponent } from './components/modal/modal.component';


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
    AdminIndexComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    HttpClientModule,
    HttpModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, //---- for database 
    // AngularFireAuthModule < ---- for auth
  ],
  providers: [CategoryService, ItemService, DbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
