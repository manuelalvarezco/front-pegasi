import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../../app.reducer';
import * as ui from '../../../shared/ui.actions';
import * as authActions from '../../auth.actions';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../models/User.model';
import {MatSnackBar} from '@angular/material/snack-bar';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: any;
  loading = false;
  uiSub: Subscription= new Subscription();

  matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private _snackBar: MatSnackBar
    ) { }


  ngOnInit(): void {
    this.buildForm();
    this.uiSub = this.store.select('ui').subscribe(ui => {
      this.loading = ui.isLoading;
    })
  }

  get emailField(){
    return this.form.get('email');
  }

  get passwordField(){
    return this.form.get('password');
  }

  private buildForm(){
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }


  login(){
    if(!this.form.valid){
      return;
    }

    this.store.dispatch(ui.isLoading())

    this.auth.login(this.form.value).subscribe(
      usuario => {
        this.store.dispatch(ui.stopLoading())
        this.store.dispatch( authActions.setUser({ user: usuario }))
        this.router.navigate(['dashboard'])
      }, err => {
        this.store.dispatch(ui.stopLoading())
        this._snackBar.open('User or password incorrect!', 'OK');
      }
    )
  }

  ngOnDestroy(): void {
    this.uiSub.unsubscribe()
  }

}
