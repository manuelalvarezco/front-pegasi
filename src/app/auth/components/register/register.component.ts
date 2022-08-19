import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../../app.reducer';
import * as ui from '../../../shared/ui.actions';


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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<AppState>
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

  private buildForm(){
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
    })
  }


  register(){
    if(!this.form.valid){
      return;
    }

    this.store.dispatch(ui.isLoading())

    setTimeout(() => {
      this.store.dispatch(ui.stopLoading())
      this.router.navigate(['dashboard'])
    }, 5000);
  }

  ngOnDestroy(): void {
    this.uiSub.unsubscribe()
  }

}
