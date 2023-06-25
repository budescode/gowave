import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  notifier: NotifierService;
  
  constructor(private router: Router, notifierService: NotifierService) {
    this.notifier = notifierService;
  
    
  }
  canActivate() {
    const token = localStorage.getItem('email');
    if(token == null){
      this.notifier.notify('error', 'You are not logged in')
      this.router.navigate(['/signin']);     
    }

    return true;
  }
}