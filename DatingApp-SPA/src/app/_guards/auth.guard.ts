import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService,
    private router:Router,private alertify:AlertifyService){}
  
    //kada imamo metodu posle koje stoje tipovi razdvojeni | to znaci da moze da vrati bilo koji od tih tipova
  // npr canActivate(): Observable<boolean> | Promise<boolean> | boolean
  
  canActivate():  boolean {
    //ako je ulogovan moze 
    if(this.authService.logedIn()){
      return true;
    }
    //ako nije saljemo obavestenje da ne moze i vracamo ga na home page
    this.alertify.error('You dont have permission for this page!');
    this.router.navigate(['/home']);
    return false;
  }
}
