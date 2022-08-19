import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../../app.reducer';
import * as ui from '../../../shared/ui.actions';
import { AuthService } from '../../services/auth.service';
import * as authActions from '../../auth.actions';
import {MatSnackBar} from '@angular/material/snack-bar';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

interface Age {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  form:any;
  matcher = new MyErrorStateMatcher();
  ages: Age[] = [
    {value: '10', viewValue: '10'},
    {value: '20', viewValue: '20'},
    {value: '30', viewValue: '30'},
  ];
  loading = false;
  uiSub: Subscription = new Subscription();
  disableSlide = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<AppState>,
    private authservice: AuthService,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.buildForm();
    this.uiSub = this.store.select('ui').subscribe(ui => {
      this.loading = ui.isLoading;
    })
  }

  get namelField(){
    return this.form.get('name');
  }

  get phoneField(){
    return this.form.get('phone');
  }

  get lastnameField(){
    return this.form.get('lastname');
  }

  get emailField(){
    return this.form.get('email');
  }

  get passwordField(){
    return this.form.get('password');
  }

  get typeField(){
    return this.form.get('type');
  }

  get genderField(){
    return this.form.get('gender');
  }

  get birthdayField(){
    return this.form.get('birthday');
  }



  private buildForm(){
    this.form = this.fb.group({
      name:['', [Validators.required]],
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
      lastname:['', [Validators.required]],
      age:['', [Validators.required]],
      gender:['', [Validators.required]],
      type:[''],
      birdhday:['', [Validators.required]],
      phone:['', [Validators.required]],
    });

    this.genderField.valueChanges.subscribe((value: string) => {
      if(value === 'male'){
        this.disableSlide = true;
      }else{
        this.disableSlide = false;
      }
    })
  }


  register(){
    if(!this.form.valid){
      return;
    }

    this.store.dispatch(ui.isLoading())

    this.authservice.register(this.form.value).subscribe(
      usuario => {
        this.store.dispatch(ui.stopLoading())
        this.store.dispatch( authActions.setUser({ user: usuario }))
        this.router.navigate(['dashboard'])
      }, err => {
        this.store.dispatch(ui.stopLoading())
        this._snackBar.open('Error in register!', 'OK');
      }
    )
  }

  ngOnDestroy(): void {
    this.uiSub.unsubscribe()
  }

}
