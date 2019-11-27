import { Injectable } from '@angular/core';
import { User } from '../user';
import { Http, Response } from '@angular/http';

const swal = require('sweetalert');
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user_id = null;
  currentuser = null;

  constructor(private http: Http) { }

  login(username, password) {

    return this.http.post('user/login',{
        user_id : username,
        password : password
      })
    .map((res:Response) => res.json())
    .catch(this.handleErrorObservable)  ;
  }

  // public login(userObj){
  //   localStorage.setItem('ACCESS_TOKEN', "access_token");
  // }

  public isLoggedIn(){
    return sessionStorage.getItem('userDetails') !== null;

  }

  public logout(){
    sessionStorage.removeItem('userDetails');
  }

  private handleErrorObservable(error: Response | any) {
    var res = JSON.parse(error._body)
    return swal(`${res.status}`, `${res.message}`, 'error');
  }
}