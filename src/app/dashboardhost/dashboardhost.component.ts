import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { Createclass } from '../classes/createclass';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-dashboardhost',
  templateUrl: './dashboardhost.component.html',
  styleUrls: ['./dashboardhost.component.css']
})
export class DashboardhostComponent implements OnInit {


  listdata:Createclass[] = []
  
  name =  Createclass.initializeData()
  notifier: NotifierService;
  
constructor(private firestore: AngularFirestore, private router: Router,private actRoute: ActivatedRoute,private spinner: NgxSpinnerService, notifierService: NotifierService) {
  this.notifier = notifierService; 
  this.getOrCreateUserProfile()
  


  }

  async getOrCreateUserProfile(){
    const email = localStorage.getItem('email')
    this.spinner.show()
    console.log('getting the user data')
    await this.firestore.collection('userprofile').ref.where('email', '==', email).get().then(
      async (querySnapshot) => {
        if (!querySnapshot.empty) {
          this.getGames()
          this.spinner.hide()
      
        
        } else {
          console.log('No matching documents found.');
          this.notifier.notify('error', 'Create Private Key')
          this.router.navigate(['/dashboard/hederatoken']);
  
        } //else
      },
      (error) => {
        console.log('Error getting documents:', error);
        this.spinner.hide()
      }
    );
    this.spinner.hide()
  }

  getGames(){
    const email = localStorage.getItem('email')
    this.firestore.collection('name', ref => ref.where('email', '==', email))
.snapshotChanges()
.subscribe(
  (querySnapshot) => {
    const data: Createclass[] = querySnapshot.map((docChange) => {
      const id = docChange.payload.doc.id;
      const documentData = docChange.payload.doc.data();
      return Object.assign({ id }, documentData) as unknown as Createclass;
    });
    this.listdata = data;
    console.log(data, 'it is here...');
    // Further processing of the filtered and streamed data
  },
  (error) => {
    console.log('Error:', error);
  }
);
  }
  generateRandomCode(): string {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#';
    let randomCode = '';
    
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      randomCode += validChars[randomIndex];
    }
    
    return randomCode;
  }
  sendMessage(){    
    if(this.name.name == ''|| this.name.description == '' || this.name.rewardhbar == ''){
      this.notifier.notify('error', 'FIll all fields')
      return;
    }  
    if(this.name.rewardhbar == 'Yes'&& this.name.hbaramount == ''){
      this.notifier.notify('error', 'Enter Hbar amount')
      return;
    }    
    const timestamp = Timestamp.now()
    const email = localStorage.getItem('email')
    const generatedUuid = uuidv4();
    const code = this.generateRandomCode()
    this.firestore
    .collection('name')    
    .add({'rewardhbar':this.name.rewardhbar, 'hbaramount':this.name.hbaramount, 'name':this.name.name, 'description':this.name.description, 'createdAt':timestamp, 'uuid':generatedUuid, 'code':code, 'start':false, 'end':false, 'currentId':'', 'email': email})
    .then((docRef) => {
      const id = docRef.id; // Get the generated document ID
      console.log(id, 'response is here...');
      this.router.navigate(['/details', code]);
    })    
    .catch((error) =>{
      
    });

  }

  ngOnInit(): void {
  }

}
 