import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthProvider, User } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { connectToMetamask } from '../services/metamaskService';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  displayname: string | null = null 
  displayEmail: string | null  = null
  constructor(private router: Router,public authService: AuthService,  public afAuth: AngularFireAuth ) {   
    this.displayname = localStorage.getItem('displayName')
    this.displayEmail= localStorage.getItem('email')
  }

  ngOnInit(): void {
  }
  async loginFunction(){
    console.log('login clicked..')
   await this.authService.GoogleAuth()
   this.getDisplayname()
  }

  async getDisplayname(){

    console.log('ckeckdjknjkddknsk', this.authService.user?.displayEmail)
    const user = await this.afAuth.currentUser;
    console.log(user, 'yeajj.', )
    if (user) {
      console.log(user.displayName)
      this.displayname = user.displayName
      this.displayEmail = user.email

    }else{
      console.log('it is null...')
    }
  }
}
