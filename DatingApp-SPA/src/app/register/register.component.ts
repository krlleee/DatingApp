import { Component, EventEmitter, Input,Output, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDaterangepickerConfig } from 'ngx-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister=new EventEmitter();
  
  user:User;
  registerForm: FormGroup;
  maxDate:Date;

  //kada zelimo da koristimo samo neka polja klase, stavljanjem partial sva polja postaju opciona
  bsConfig: Partial<BsDaterangepickerConfig>;

  constructor(private authService:AuthService,
     private alertify:AlertifyService,private fb: FormBuilder,private router:Router) {
       this.maxDate=new Date();
       this.maxDate.setDate(this.maxDate.getDate()+0);
      }

  ngOnInit() {
    this.bsConfig={
      containerClass:'theme-red',
    }
    this.createRegisterForm();
  }

  createRegisterForm(){
    this.registerForm=this.fb.group({
      gender: ['male'],
      username: ['',Validators.required],
      knownAs: ['',Validators.required],
      dateOfBirth: [null,Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      password: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: ['',Validators.required]
    },{validator:this.passwordMatchValidator});
  }

  passwordMatchValidator(g:FormGroup){
    //proveravamo da li su pass i conf pass isti ako jesu okej ako nisu vracamo missmatch
    return g.get('password').value===g.get('confirmPassword').value ? null : {'missmatch':true};
  }

  register(){
//proverimo da li je forma validna,pokupimo podatke sa forme dodelimo user-u
//nakon registracije treci parametar subscriba je when complete,kada se registruje ulogujemo ga i prebacimo na members stranicu
    if(this.registerForm.valid){
      this.user = Object.assign({},this.registerForm.value);
      this.authService.register(this.user).subscribe(()=>{
      this.alertify.success('Registration successful');
      },error=>{
        this.alertify.error(error);
      }, ()=>{
        this.authService.login(this.user).subscribe(()=>{
          this.router.navigate(['/members']);
        });
      });
      
    }
   
  }

  cancel(){
    this.cancelRegister.emit(false);
   
    
  }
}
