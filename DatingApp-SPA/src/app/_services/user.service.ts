import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';




@Injectable({
  providedIn: 'root'
})
export class UserService {
  //definisali smo url u enviroments folderu
  baseUrl=environment.apiUrl;

constructor(private http:HttpClient) { }

getUsers():Observable<User[]>{

  return this.http.get<User[]>(this.baseUrl+'user');

}

getUser(id):Observable<User>{

  return this.http.get<User>(this.baseUrl + 'user/' + id);
}

updateUser(id: number,user:User){
  return this.http.put(this.baseUrl+'user/'+id,user);
}

setMainPhoto(userId: number,id: number){
  return this.http.post(this.baseUrl+'user/'+userId+'/photos/'+id+'/setMain',{});
}

deletePhoto(userId: number, id:number)
{
  return this.http.delete(this.baseUrl+'user/' + userId + '/photos/' + id);
}

}
