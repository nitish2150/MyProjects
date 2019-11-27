import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { OfferService } from 'app/services/offer.service';
import { DataService } from '../services/data.service';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
declare var $: any;
const swal = require('sweetalert');


@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.css'],
  providers: [OfferService, DataService, DatePipe]
})
export class OffersListComponent implements OnInit {
  @ViewChild(ModalDirective, {read: true, static: false }) addOffer:ModalDirective;

  loading = false;
  offers = [];
  offersBkp = [];
  offerForm: FormGroup;
  offerControlForm: FormControl;
  totalRec : number;
  page: number = 1;
  baseUrl=null;
  valueControl:FormControl;
  typeControl:FormControl;
  descControl:FormControl;
  codeControl:FormControl;
  validFromControl:FormControl;
  validToControl:FormControl;
  pointControl:FormControl;
  fileControl:FormControl;
  public offerData;
  isPoint = false;
  mode = "new";
  public loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

  public popoverTitle:string='Confirmation';
  public popoverMessage:string='Are you sure you want to delete offer?';
 public confirmClicked:boolean=false;
 public cancleClicked:boolean=false;
  selectedOffer= null
  
 


 constructor(private formBuilder:FormBuilder,private datePipe:DatePipe,private offerService:OfferService, private data:DataService, private spinnerService: Ng4LoadingSpinnerService ) { 
  this.baseUrl = this.data.getBaseUrl();
  this.valueControl = this.formBuilder.control('', Validators.required);
  this.typeControl = this.formBuilder.control('', Validators.required);
  this.descControl = this.formBuilder.control('', Validators.required);
  this.codeControl = this.formBuilder.control('', Validators.required);
  this.validFromControl = this.formBuilder.control('', Validators.required);
  this.validToControl = this.formBuilder.control('', Validators.required);
  this.pointControl = this.formBuilder.control('', Validators.required);
  this.fileControl = this.formBuilder.control('', null);

  this.offerForm = this.formBuilder.group({
    'value': this.valueControl,
    'type': this.typeControl,
    'desc': this.descControl,
    'code': this.codeControl,
    'validFrom': this.validFromControl,
    'validTo': this.validToControl,
    'point': this.pointControl,
    'fileInput': this.fileControl
  });
 }

  ngOnInit() {
    this.getOffer();
    this.reset();
  }

  reset(){
    this.offerForm.reset();  
    this.offerForm.get('value').setValue(0);
    this.offerForm.get('point').setValue(0);
    this.offerForm.get('fileInput').setValue(null)
  }
  
  getOffer() {
   this.spinnerService.show();
    // this.loading = true;
    this.offerService. getOffers({}).subscribe(
      (data: any) => {
        this.spinnerService.hide();
        //this.loading = true;
        this.offers = data.offers;
        this.offersBkp = data.offers;
        
        this.totalRec = this.offers.length;
      },
      error => {
        this.spinnerService.hide();
        //  this.loading = false;
      }
    );
  }

  submitForm($ev) {
    $ev.preventDefault();
    for (let c in this.offerForm.controls) {
      this.offerForm.controls[c].markAsTouched();
    }

    if (this.offerForm.valid) {
      this.saveOffer();
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.offerForm.get('fileInput').setValue(file);
    }
  }

  applyFilter(){
    var serachText  = $('#searchText').val()
    if(serachText){
      this.offers = this.flowFilter(this.offersBkp, serachText.toLowerCase());
    } else {
      swal(`Alert`, `Please enter something to search`, 'error')
    }
    
  }


flowFilter(array, substr) {
    return _.filter(array, _.flow(
    _.identity,
    _.values,
    _.join,
    _.toLower,
    _.partialRight(_.includes, substr)
  ));
}

  resetFilter(){
    $('#searchText').val('')
    this.offers = this.offersBkp;
  }

  saveOffer() {
    const formData = new FormData();
    formData.append('fileInput', this.offerForm.get('fileInput').value);
    var offerDto = {
      "offerValue": parseInt(this.offerForm.get('value').value),
      "offerType": this.offerForm.get('type').value,
      "offerDesc": this.offerForm.get('desc').value,
      "offerCode": this.offerForm.get('code').value,
      "validFrom": this.dateFormatter(this.offerForm.get('validFrom').value, 'yyyy-MM-dd'),
      "validTo": this.dateFormatter(this.offerForm.get('validTo').value, 'yyyy-MM-dd'),
      "point": parseInt(this.offerForm.get('point').value) 
    };
    formData.append('offerdetails', JSON.stringify(offerDto));
    
    if(this.isPoint && this.offerForm.get('point').value === 0){
      swal(`Alert`, `Please enter point value other than 0.`, 'error')
    } else if(!this.isPoint && this.offerForm.get('value').value === 0){
      swal(`Alert`, `Please enter offer value other than 0.`, 'error')
    } else {
      this.spinnerService.show();
      this.offerService.saveOffer(formData).subscribe(
        (data: any) => {
          this.spinnerService.hide();
          // this.loading = false; 
          if(data.status == 'Success'){
            this.data.showNotification("success", data.message)
            this.hideModal();
            this.getOffer();
          }
          
        },
        error => {
          this.spinnerService.hide();
          //   this.loading = false;
        }
      );
    }
  }

  selectOfferType(value) {
    if(value.toUpperCase() === 'POINTS'){
      this.isPoint = true;
    } else {
      this.isPoint = false;
    }

    this.offerForm.get('value').setValue(0)
    this.offerForm.get('desc').setValue('')
    this.offerForm.get('code').setValue('')
    this.offerForm.get('validFrom').setValue('')
    this.offerForm.get('validTo').setValue('')
    this.offerForm.get('point').setValue(0) 
  }

  hideModal(){
    this.reset()
    this.isPoint = false;
    $("#addOffer").modal("hide");

  }

  deleteOffer(offerId) {
    this.spinnerService.show()
    this.offerService.deleteOffer(offerId).subscribe(
      (data: any) => {
        this.spinnerService.hide();
        //this.loading = false; 
        if(data.status == 'Success'){
          this.data.showNotification("success", data.message);
          this.getOffer();
        }        
      },
      error => {
        this.spinnerService.hide();
        // this.loading = false;
      }
    );
  }


  dateFormatter(date, format){
    if(format){
      return  this.datePipe.transform(date , format);
    } else{
      return  this.datePipe.transform(date ,"d-MMM-y");
    }
    
  }

  imageUrlFormater(imagePath){
    var url = this.baseUrl;
    if(imagePath){
      return url.substr(0,url.lastIndexOf('/')) +imagePath;
    } else {
      return '/assets/img/offer.jpg'
    }
    
  }

  showModal(mode, item){
    $("#addOffer").modal({backdrop: 'static', keyboard: false, show: true});  
    if(mode === 'new'){
      this.mode = "new"
    } else {
      this.mode = "edit"
      this.selectedOffer = item;
      if(item){
       // var typeObj = _.find(this.offerForm, function(obj) {
        //  return obj.type == item.selectOfferType; 
        //});
      //  if(item.offerType === )
          
        this.offerForm.patchValue({
          'type': item.offerType,
          'value': item.offerValue,
          'code': item.offerCode,
          'desc': item.offerDesc, 
          'point':item.offerPoint,
          'validFrom': item.offerValidFrom,
          'validTo': item.offerValidTo
        }); 
    }
  }
}

  updateOffer(){
    var offerDto = {
      "id": this.selectedOffer.o_id,
      "offerValue": parseInt(this.offerForm.get('value').value),
      "offerType": this.offerForm.get('type').value,
      "offerDesc": this.offerForm.get('desc').value,
      "offerCode": this.offerForm.get('code').value,
      "validFrom": this.dateFormatter(this.offerForm.get('validFrom').value, 'yyyy-MM-dd'),
      "validTo": this.dateFormatter(this.offerForm.get('validTo').value, 'yyyy-MM-dd' ),
      "point": parseInt(this.offerForm.get('point').value) 
    };
    
    if(this.isPoint && this.offerForm.get('point').value === 0){
      swal(`Alert`, `Please enter point value other than 0.`, 'error')
    } else if(!this.isPoint && this.offerForm.get('value').value === 0){
      swal(`Alert`, `Please enter offer value other than 0.`, 'error')
    } else {
      this.spinnerService.show();
      this.offerService.updateOffer(offerDto).subscribe(
        (data: any) => {
          this.spinnerService.hide();
          // this.loading = false; 
          if(data.status == 'Success'){
            this.data.showNotification("success", data.message)
            this.hideModal();
            this.selectedOffer = null;
            this.getOffer();
          }
          
        },
        error => {
          this.spinnerService.hide();
          //   this.loading = false;
        }
      );
    }


  }

  

}
