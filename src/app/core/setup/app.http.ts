import { Injectable } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

const swal = require('sweetalert');

@Injectable()
export class PlusWorksHttp extends Http {

  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private router: Router) { 
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
     var loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
     if (loggedInUser) {    
      if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
        if (!options) {
          // let's make option object
          options = {headers: new Headers()};
        }
        options.headers.set('X-AuthToken', loggedInUser.authToken);
      } else {
      // we have to add the token to the url object
        url.headers.set('X-AuthToken', loggedInUser.authToken);
      }
    }

    return super.request(url, options).catch((error: Response) => {
            if ((error.status === 401 || error.status === 403) && (window.location.href.match(/\?/g) || []).length < 2) {
                this.router.navigate(['/'], { queryParams: { returnUrl: this.router.url }});
            } else if (error.status == 0) {
              // swal(`Error`, `Unknown Error Occured. Server response not received.`, 'error');
            } else if (!navigator.onLine && error.status != 404) {
              swal(`Connection Issue`, `Unable to communicate with server. Please check your internet connection.`, 'error');
            }
            return Observable.throw(error);
        });
  }
}