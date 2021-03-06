import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt'
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl=environment.apiUrl+'auth/';
  jwtHelper=new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl=new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl=this.photoUrl.asObservable();
  
constructor(private http: HttpClient) { }

changeMemberPhoto(photoUrl: string){
  this.photoUrl.next(photoUrl);
}

login(model: any){
  return this.http.post(this.baseUrl+'login',model)
  .pipe(
    map((response:any)=>{
    const user=response;
    if(user)
    {
      
      localStorage.setItem('token',user.token);
      localStorage.setItem('user',JSON.stringify(user.user));
      //dekodiramo token prilikom logina (pogledaj u appcomponent.ts kako je regulisano da imamo token i prilikom refresovanja stranice)
      this.decodedToken=this.jwtHelper.decodeToken(user.token);
      this.currentUser=user.user;
      this.changeMemberPhoto(this.currentUser.photoUrl);
    }
  }));
}

register(user: User){
  return this.http.post(this.baseUrl+'register',user);
}

logedIn(){
  const token=localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);
}


}
