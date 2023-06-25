import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { Createclass } from '../classes/createclass';

@Component({
  selector: 'app-dashboardhost',
  templateUrl: './dashboardhost.component.html',
  styleUrls: ['./dashboardhost.component.css']
})
export class DashboardhostComponent implements OnInit {


  listdata:Createclass[] = []
  
  name =  Createclass.initializeData()

constructor(private firestore: AngularFirestore, private router: Router,private actRoute: ActivatedRoute,) {
  console.log('initialize....')

  
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
    const timestamp = Timestamp.now()
    const email = localStorage.getItem('email')
    const generatedUuid = uuidv4();
    const code = this.generateRandomCode()
    this.firestore
    .collection('name')    
    .add({'name':this.name.name, 'description':this.name.description, 'createdAt':timestamp, 'uuid':generatedUuid, 'code':code, 'start':false, 'end':false, 'currentId':'', 'email': email})
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
 