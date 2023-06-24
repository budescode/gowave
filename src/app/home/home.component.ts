import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthProvider, User } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayname: string | null = null 
  displayEmail: string | null  = null
  code:any

  constructor(private router: Router,public authService: AuthService,  public afAuth: AngularFireAuth ) {   
this.displayname = localStorage.getItem('displayName')
this.displayEmail= localStorage.getItem('email')

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

 
  async ngOnInit(): Promise<void> {

  }
  async loginFunction(){
    console.log('login clicked..')
   await this.authService.GoogleAuth()
   this.getDisplayname()
  }

  submitData(){
    this.router.navigate(['/playgamegame', this.code]);
  }
}
