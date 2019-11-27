import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { range } from 'rxjs';
import { map, filter } from 'rxjs/operators';

const swal = require('sweetalert');
@Injectable()

export class ProductService {

    data: Object;
    loading: boolean;

    constructor(private http: Http) { }

  
  getProducts(data) {
    return this.http.post('product/list', data)
      .map((response: Response) => {
        return response.json();
      }).catch(this.handleErrorObservable);
  }

  saveProduct(formData) {
    return this.http.post('product/create', formData)
      .map((response: Response) => {
        return response.json();
      }).catch(this.handleErrorObservable);
  }

  updateProduct(productObj) {
    return this.http.post('product/update', productObj)
      .map((response: Response) => {
        return response.json();
      }).catch(this.handleErrorObservable);
  }

  deleteProduct(productId) {
    return this.http.delete('product/'+productId)
      .map((response: Response) => {
        return response.json();
      }).catch(this.handleErrorObservable);
  }

private handleErrorObservable(error: Response | any) {
    var res = JSON.parse(error._body)
    return swal(`${res.status}`, `${res.message}`, 'error');
  }
}

