import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import { User } from  '../user';
import { AuthService } from  '../services/auth.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isSubmitted  =  false;
  loading = false;
  currentUser = null;

  constructor(private spinnerService: Ng4LoadingSpinnerService,private authService: AuthService, private router: Router, private formBuilder: FormBuilder ) { 
    this.currentUser = JSON.parse(sessionStorage.getItem('userDetails'));
    
  }

  ngOnInit() {
    this.loginForm  =  this.formBuilder.group({
      userName: ['', Validators.required],
        password: ['', Validators.required] 
    });

    if(this.currentUser){
      this.router.navigate(['dashboard']);
    }
}

get formControls() { return this.loginForm.controls; }

login(){
  this.isSubmitted = true;
  if(this.loginForm.invalid){
    return;
  }

  this.spinnerService.show();
  //this.loading = true;
  this.authService.login(this.loginForm.value.userName, this.loginForm.value.password).subscribe(
    (data: any) => {
      if(data.status === "success"){
        this.spinnerService.hide();
        //this.loading = false;
        sessionStorage.setItem('userDetails', JSON.stringify(data.userDetails));
        this.router.navigate(['dashboard']);
      }      
    },
    error => {
      this.spinnerService.hide();
      // this.loading = false;
    }
  );
  // this.authService.login(userObj);
  
  //this.router.navigateByUrl('/admin');
}

}
