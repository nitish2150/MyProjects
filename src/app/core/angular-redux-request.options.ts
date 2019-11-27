import { BaseRequestOptions } from '@angular/http';

export class AngularReduxRequestOptions extends BaseRequestOptions {
  

    constructor (angularReduxOptions?: any) {

        super();
        
         //var user = JSON.parse(localStorage.getItem('user'));
         var user = JSON.parse(sessionStorage.getItem('loggedInUser'));
         
         this.headers.append('Content-Type', 'application/json');
         this.headers.append('X-AuthToken', 'Bearer ' + (user && user.authToken) );

        if (angularReduxOptions != null) {

            for (let option in angularReduxOptions) {
                let optionValue = angularReduxOptions[option];
                this[option] = optionValue;
               // option.headers.set('X-AuthToken', this.token);
            }
        }
    }

    
}