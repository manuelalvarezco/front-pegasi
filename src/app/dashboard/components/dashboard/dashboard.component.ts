import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  user: any;
  authSub: Subscription = new Subscription();

  constructor(private store: Store<AppState>,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.authSub = this.store.select('user').subscribe( usuario => {
      if(!usuario.user){
        this.router.navigate(['/'])
      }
      this.user = usuario.user;
    })
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

}
