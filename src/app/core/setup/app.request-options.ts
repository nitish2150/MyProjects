import {BaseRequestOptions, RequestOptions, RequestOptionsArgs} from '@angular/http';
import { DataService } from '../../services/data.service';
import { Headers } from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class PlusworksRequestOptions extends RequestOptions  {
    
    constructor(private data: DataService){
        super()
    }
	
    merge(options?:RequestOptionsArgs):RequestOptions {
        if(this.data){
            super['data'] = this.data;
        }
        if(options.url != null) {
            options.url = this.data.baseUrl + options.url;			 					
        }        
        var result = super.merge(options);
        result.merge = this.merge;
        return result;
    }
}