import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { ProductService } from 'app/services/product.service';
import { DataService} from '../services/data.service'
import { CategoryService } from 'app/services/category.service';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var $: any;
const swal = require('sweetalert');
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ProductService, DataService,CategoryService]
})
export class ProductListComponent implements OnInit {
  @ViewChild(ModalDirective, {read: true, static: false }) addProductModal:ModalDirective;
  loading = false;
  products = [];
  productsBkp = [];
  categories=[];
  weightPrice=[];
  productForm: FormGroup;
  productControlForm: FormControl;
  totalRec : number;
  page: number = 1;
  baseUrl=null;
  nameControl:FormControl;
  categoryControl:FormControl;
  fileControl:FormControl;
  codeControl:FormControl;
  public productData;
  mode = "new";
  public loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  selectedProduct = null

  public popoverTitle:string='Confirmation';
  public popoverMessage:string='Are you sure you want to delete product?';
 public confirmClicked:boolean=false;
 public cancleClicked:boolean=false;

  constructor(private formBuilder:FormBuilder,private categoryService:CategoryService,private productService:ProductService, private dataService:DataService,private spinnerService: Ng4LoadingSpinnerService) { 
    this.baseUrl = this.dataService.getBaseUrl();
    this.nameControl = this.formBuilder.control('', Validators.required);
    this.codeControl = this.formBuilder.control('', null);
    this.categoryControl = this.formBuilder.control('', Validators.required);
    this.fileControl = this.formBuilder.control('', null);//Validators.required);

    this.productForm = this.formBuilder.group({
      'name': this.nameControl,
      'code': this.codeControl,
      'categoryId': this.categoryControl,
      'fileInput': this.fileControl
    });
  }
  
  ngOnInit() {
    this.getCategories();
    this.getProducts(); 
    this.productForm.reset(); 
  }

  getCategories() {
    this.spinnerService.show();
    //this.loading = true;
    this.categoryService.getCategories().subscribe(
      (data: any) => {
       // this.loading = true;
        this.categories = data;
        this.spinnerService.hide();
         this.totalRec = this.categories.length;
      },
      error => {
        this.spinnerService.hide();
        //this.loading = false;
      }
    );
  }

  getProducts() {
    this.spinnerService.show();
    // this.loading = true;
    this.productService.getProducts({}).subscribe(          ///{"start": 0,"limit": 10}
      (data: any) => {
       // this.loading = false;
        this.products = data.products;
        this.productsBkp = data.products;
        this.spinnerService.hide();
        this.totalRec = this.products.length;
      
      },
      error => {
        this.spinnerService.hide();
        //this.loading = false;
      }
    );
  }

  updateWeightage(){
    var weight = $('#weight').val(),
    price = $('#price').val();

    if(!weight || !price){
      swal(`Alert`, `Weight and price both are required.`, 'error')
    } else {
      var isExist = _.find(this.weightPrice, function(item) {
              return item.weight == weight; 
          });

      if(isExist){
        swal(`Alert`, `This weight is already exist. If you want to update then remove exisiting then add it again.`, 'error')
      } else {
        $('#weight').val('');
        $('#price').val('');
        this.weightPrice.push({weight: weight, price: price})
      }      
    }
  }

  removeWeigtage(weight){
    _.remove(this.weightPrice, function(item) {
        return item.weight === weight;
    });
  }

  submitForm($ev) {
    $ev.preventDefault();
    for (let c in this.productForm.controls) {
      this.productForm.controls[c].markAsTouched();
    }

    if (this.productForm.valid) {
      this.saveProduct();
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.productForm.get('fileInput').setValue(file);
    }
  }

  applyFilter(){
    var serachText  = $('#searchText').val()
    if(serachText){
      this.products = this.flowFilter(this.productsBkp, serachText.toLowerCase());
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
    this.products = this.productsBkp;
  }

  saveProduct() {
    const formData = new FormData();
    formData.append('fileInput', this.productForm.get('fileInput').value);
    var productDto = {
      "name": this.productForm.get('name').value,
      "code": this.productForm.get('code').value,
      "categoryId": this.productForm.get('categoryId').value,
      "weightPrice":this.weightPrice
    };
    formData.append('productdetails', JSON.stringify(productDto));
    if(_.isEmpty(this.weightPrice)){
      swal(`Alert`, `Please add atleast one weightage.`, 'error')
    } else{
      this.productService.saveProduct(formData).subscribe(
        (data: any) => {
          this.loading = false; 
          this.dataService.showNotification("success", data.message)
          this.hideModal();
          this.getProducts();
        },
        error => {
          this.loading = false;
        }
      );
    }
    
  }

  showWeightPriceModal(item){
    this.weightPrice = [];
    var weightPriceList = JSON.parse(JSON.stringify(item.weightPrice));
    var weightPriceArray = _.map(_.keys(weightPriceList), function(key) {
          return  JSON.parse(weightPriceList[key])
    });
    this.weightPrice = weightPriceArray;  
    
    $("#weight-price").modal({backdrop: 'static', keyboard: false, show: true});  
         
  }
  showModal(mode, item){
    $("#addProductModal").modal({backdrop: 'static', keyboard: false, show: true});  
    if(mode === 'new'){
      this.mode = "new"
    } else {
      this.mode = "edit"
      this.selectedProduct = item;
      if(item){
        var categoryObj = _.find(this.categories, function(obj) {
          return obj.name == item.category; 
        });

        this.productForm.patchValue({
          'name': item.productName,
          'code': item.productCode,
          'categoryId': categoryObj.id
        });

        var weightPriceList = JSON.parse(JSON.stringify(item.weightPrice));
        var weightPriceArray = _.map(_.keys(weightPriceList), function(key) {
              return  JSON.parse(weightPriceList[key])
        });
        this.weightPrice = weightPriceArray;
      }
    }
  }

  deleteProduct(productId) {
    this.productService.deleteProduct(productId).subscribe(
      (data: any) => {
        this.loading = false; 
        if(data.status == 'Success'){
          this.dataService.showNotification("success", data.message);
          this.getProducts();
        }        
      },
      error => {
        this.loading = false;
      }
    );
  }

 
  hideModal(){
    this.productForm.reset();
    $("#addProductModal").modal("hide");   
    this.productForm.get('fileInput').setValue(null)
    this.weightPrice =[];
    $('#weight').val('');
    $('#price').val('');
  }

  imageUrlFormater(imagePath){
    var url = this.baseUrl;
    return url.substr(0,url.lastIndexOf('/')) +imagePath;    
  }


  updateProduct() {
    var productDto = {
      "id": this.selectedProduct.p_id,
      "name": this.productForm.get('name').value,
      "code": this.productForm.get('code').value,
      "categoryId": this.productForm.get('categoryId').value,
      "weightPrice":this.weightPrice
    };
    
    if(_.isEmpty(this.weightPrice)){
      swal(`Alert`, `Please add atleast one weightage.`, 'error')
    } else{
      this.productService.updateProduct(productDto).subscribe(
        (data: any) => {
          this.loading = false; 
          this.dataService.showNotification("success", data.message)
          this.hideModal();
          this.selectedProduct = null;
          this.getProducts();
        },
        error => {
          this.loading = false;
        }
      );
    }
    
  }

}
