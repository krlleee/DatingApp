import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt'
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl="http://localhost:5000/api/auth/";
  jwtHelper=new JwtHelperService();
  decodedToken: any;
  
constructor(private http: HttpClient) { }

login(model: any){
  return this.http.post(this.baseUrl+'login',model)
  .pipe(
    map((response:any)=>{
    const user=response;
    if(user)
    {
      
      localStorage.setItem('token',user.token);
      //dekodiramo token prilikom logina (pogledaj u appcomponent.ts kako je regulisano da imamo token i prilikom refresovanja stranice)
      this.decodedToken=this.jwtHelper.decodeToken(user.token);
      console.log(this.decodedToken);
    }
  }));
}

register(model: any){
  return this.http.post(this.baseUrl+'register',model);
}

logedIn(){
  const token=localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);
}


}
