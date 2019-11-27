import { Injectable } from '@angular/core';
import { environment } from '../core/setup/app.environment';
import {i18} from 'assets/i18n/labels';
import * as _ from 'lodash';
import * as moment from 'moment';
declare var $: any;
@Injectable()
export class DataService {

    public storage: any;
    currentUser: any;
    baseUrl: string = '';
    tenant: string = '';
    isImage:boolean ;

    public constructor() { 
      this.currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
      this.baseUrl = this.getBaseUrl();

      var hostName =  window.location.hostname;
      this.tenant = hostName.split(".")[0];

    }

   getLabels() {
     return i18[this.tenant] || {};
   } 
  
   setStorage(data) {
      sessionStorage.setItem('storage', JSON.stringify(data));
   }
  
   getStorage() {
     this.storage = [];
     this.storage = JSON.parse(sessionStorage.getItem('storage'));
     return this.storage; 
   }
  
   removeStorage() {
      sessionStorage.removeItem('storage');                
   }

   getConfigValue(arr, configKey) {
    let config = arr && arr.find(config => config.confKey == configKey);
    return (config ? config.value: null);
   }

   getUserRoles() {    
    return (this.currentUser.permissions ? this.currentUser.permissions.roles : []);
   }

  getBaseUrl() {
    // return ((environment.protocal.indexOf(':')>0)? environment.protocal+'//':environment.protocal+'://') +
    //        environment.host +
    //        (environment.port && environment.port !== '' ? ':' + environment.port : '') + "/" +
    //        environment.api_base_rul  + "/";
      return "http://3.13.212.113:3000/"
    // return "http://localhost:3000/"
    
  }
  

  differnceInDay(day) {
    if (day) {
      day = moment.parseZone(day);
      var date = new Date(day);
      var minutes = (date.getTime() - new Date().getTime()) / (1000 * 60);
      var hrs = minutes / 60;
      var diffDay = Math.ceil(hrs / 24);
      diffDay = Math.abs(diffDay)
    }
    else {
      day = ""
    }
    return diffDay
  }

  setLabelsInLocalStorage(data){
    let labels = {};
    data.forEach(element => {
      labels[element.stringId] = element.value;
  });
  sessionStorage.setItem('i18n', JSON.stringify(labels));
  return labels; 
  }

  showNotification(status, message){
    var type
    if(status === 'success'){
      type  = "success"
    } else {
      type  = "danger"
    }
    const color = Math.floor((Math.random() * 4) + 1);

    var iconType = "done";

    $.notify({
          icon: iconType,
          message: message

      },{
          type: type,
          timer: 1000,
          placement: {
              from: 'top',
              align: 'center'
          },
          template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
            '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
            '<i class="material-icons" data-notify="icon">'+ iconType +'</i> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
          '</div>'
      });
  }
}
