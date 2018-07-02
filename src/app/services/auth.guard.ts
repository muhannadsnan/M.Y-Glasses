import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private categoryService: CategoryService,
              private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this.categoryService.isLoggedin){
        // redirect to a path when loggen in
        // this.router.navigate(['categories'], {queryParams: {returnParam: state.url}});
        return true;
      }
      this.router.navigate(['home'], {queryParams: {returnParam: state.url}});
      return false;
  }
}
