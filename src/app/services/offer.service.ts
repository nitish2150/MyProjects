import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { range } from 'rxjs';
import { map, filter } from 'rxjs/operators';

const swal = require('sweetalert');
@Injectable()

export class OfferService {

    data: Object;
    loading: boolean;

    constructor(private http: Http) { }

    //getProducts() {
       // var url = 'product/list';
        
     //   return this.http.get(url).map((response: Response) => {
       //     return response.json();
     //     }).catch(this.handleErrorObservable);
     // }

  getOffers(data) {
    return this.http.post('offer/list', data)
      .map((response: Response) => {
        return response.json();
      }).catch(this.handleErrorObservable);
   }

   saveOffer(formData) {
    return this.http.post('offer/create', formData)
      .map((response: Response) => {
        return response.json();
      }).catch(this.handleErrorObservable);
  }

  deleteOffer(offerId) {
    return this.http.delete('offer/'+offerId).map((response: Response) => {
        return response.json();
      }).catch(this.handleErrorObservable);
   }

   updateOffer(offerObj){
     return this.http.post('offer/update',offerObj)
     .map((response: Response) =>{
       return response.json()
     }).catch(this.handleErrorObservable)
   }

private handleErrorObservable(error: Response | any) {
    var res = JSON.parse(error._body)
    return swal(`${res.status}`, `${res.message}`, 'error');
  }
}

