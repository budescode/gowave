import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore,  } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule,  } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { NameComponent } from './name/name.component';
import { NamedetailsComponent } from './namedetails/namedetails.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { MygamesComponent } from './mygames/mygames.component';
import { AuthService } from './services/auth.service';
import { PlaygameComponent } from './playgame/playgame.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { SupportComponent } from './support/support.component';
import { SigninComponent } from './signin/signin.component';
import { NavComponent } from './nav/nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardnavComponent } from './dashboardnav/dashboardnav.component';
import { DashboardhostComponent } from './dashboardhost/dashboardhost.component';
import { NotifierModule } from 'angular-notifier';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GettokenComponent } from './gettoken/gettoken.component';

const firebaseConfig = {
  apiKey: "AIzaSyBOBefVMKOX7HeAvnuBlzHPElbXY9eoBC8",
  authDomain: "gowave-5e974.firebaseapp.com",
  projectId: "gowave-5e974",
  storageBucket: "gowave-5e974.appspot.com",
  messagingSenderId: "501609462112",
  appId: "1:501609462112:web:2bebd04c8c6d9fc9ab4605",
  measurementId: "G-6FW3H4TREX"
};
@NgModule({
  declarations: [
    AppComponent,
    NameComponent,
    NamedetailsComponent,
    HomeComponent,
    GameComponent,
    MygamesComponent,
    PlaygameComponent,
    LoginComponent,
    AboutComponent,
    SupportComponent,
    SigninComponent,
    NavComponent,
    DashboardComponent,
    DashboardnavComponent,
    DashboardhostComponent,
    GettokenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NotifierModule,
    NgxSpinnerModule,
    BrowserAnimationsModule, 
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule, 
    
    
    // provideFirebaseApp(() => getFirestore()),
      AngularFirestoreModule,
      
    //   AngularFireStorageModule,

     //provideFirebaseApp(() => initializeApp( firebaseConfig )),
    provideFirestore(() => getFirestore()),

     //   AngularFirestoreModule,
    //   AngularFireStorageModule,
  
    // provideFirebaseApp(() => initializeApp()),
   
 
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})



// Initialize Firebase


export class AppModule { 
  // constructor() {


  //   // const app = initializeApp(firebaseConfig);
  // }
}
