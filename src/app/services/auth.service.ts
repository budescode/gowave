import { Injectable } from '@angular/core';
import { GoogleAuthProvider, User } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User | any;
  constructor(
    public afAuth: AngularFireAuth // Inject Firebase auth service
  ) {}
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider: GoogleAuthProvider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        console.log('You have been successfully logged in!', result.credential?.signInMethod, result.user?.displayName);
        this.afAuth.currentUser.then((e)=>{
          console.log(e, 'okay oo..')
          if(e?.email!=null){
            localStorage.setItem('email', e.email)
          }
          if(e?.displayName!=null){
            localStorage.setItem('displayName', e.displayName)
          }
          
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }


}