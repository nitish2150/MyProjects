import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { range } from 'rxjs';
import { map, filter } from 'rxjs/operators';

const swal = require('sweetalert');
@Injectable()
export class CategoryService {

  data: Object;
  loading: boolean;

  constructor(private http: Http) { }

  getCategories() {
    var url = 'master/categories';
    
    return this.http.get(url).map((response: Response) => {
        return response.json();
      }).catch(this.handleErrorObservable);
  }

  saveCategory(formData) {
    return this.http.post('master/category/create', formData)
      .map((response: Response) => {
        return response.json();
      }).catch(this.handleErrorObservable);
  }


//   applyFilters(data) {
//     return this.http.post('stores/offers', data)
//       .map((response: Response) => {
//         return response.json();
//       }).catch(this.handleErrorObservable);
//   }

  private handleErrorObservable(error: Response | any) {
    var res = JSON.parse(error._body)
    return swal(`${res.status}`, `${res.message}`, 'error');
  }
}

