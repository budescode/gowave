import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(public authService: AuthService,private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
  }
  async loginFunction(){
    console.log('login clicked..')
    
   await this.authService.GoogleAuth()
  //  this.getDisplayname()
  }

}
