import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'app/services/category.service';
import { DataService } from '../services/data.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
declare var $: any;
const swal = require('sweetalert');
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  providers: [CategoryService,DataService]
})
export class CategoryListComponent implements OnInit {
  loading = false;
  categoryForm: FormGroup;
  nameControl:FormControl;
  fileControl:FormControl;
  categories = [];
  totalRec : number;
  page: number = 1;
  baseUrl = null;
  constructor(private categoryService:CategoryService, private data:DataService,private formBuilder:FormBuilder,private spinnerService: Ng4LoadingSpinnerService) { 
    this.baseUrl = this.data.getBaseUrl();
    this.nameControl = this.formBuilder.control('', Validators.required);
    this.fileControl = this.formBuilder.control('', Validators.required);

    this.categoryForm = this.formBuilder.group({
      'name': this.nameControl,
      'fileInput': this.fileControl
    });
  }

  ngOnInit() {
    this.getCategories();
    

    this.categoryForm.reset();   
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

  submitForm($ev) {
    $ev.preventDefault();
    for (let c in this.categoryForm.controls) {
      this.categoryForm.controls[c].markAsTouched();
    }

    if (this.categoryForm.valid) {
      this.saveCategory();
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.categoryForm.get('fileInput').setValue(file);
    }
  }

  saveCategory() {
    const formData = new FormData();
    var file = this.categoryForm.get('fileInput').value,
        categoryName = this.categoryForm.get('name').value;

    formData.append('fileInput', file);
    formData.append('name', JSON.stringify(categoryName));
    if(file && name){
      swal(`Alert`, `Please add atleast one weightage.`, 'error')
    } else{
      this.categoryService.saveCategory(formData).subscribe(          ///
        (data: any) => {
          this.spinnerService.hide();
          // this.loading = false; 
          this.data.showNotification("success", data.message)
          this.hideModal();
          this.getCategories();
        },
        error => {
          this.spinnerService.show();
          //    this.loading = false;
        }
      );
    }
    
  }

  hideModal(){
    this.categoryForm.reset();
    $("#add-category").modal("hide");   
    this.categoryForm.get('fileInput').setValue(null)
  }

  imageUrlFormater(imagePath){
    var url = this.baseUrl;
    return url.substr(0,url.lastIndexOf('/')) +imagePath;
  }

}
