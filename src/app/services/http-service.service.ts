import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { concat } from 'rxjs';
import { User } from './../components/models/user';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  url = "https://jsonplaceholder.typicode.com/users";

  constructor(private http: HttpClient) { }

  getAllUsers(){
    return this.http.get(this.url);
  }

  getUserByid(id){
    return this.http.get<User>(`${this.url}/${id}`);
  }

  postUser(user){
    return this.http.post(`${this.url}`, user);
  }

  changeUser(id, user){
    return this.http.put(`${this.url}/${id}`, JSON.stringify(user));
  }
  
  deleteUser(id){
    return this.http.delete(`${this.url}/${id}`);
  }
  
  deleteUsers(usersIds){
    const requests = usersIds.map(id => {
      return this.http.delete(`${this.url}/${id}`)
    });
    const concatedObservabel$ = concat(...requests);
    return concatedObservabel$;
  }
    
  




  
}
