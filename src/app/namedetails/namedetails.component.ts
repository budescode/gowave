import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, Timestamp } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { Createclass } from '../classes/createclass';
import { Detailsclass } from '../classes/detailsclass';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-namedetails',
  templateUrl: './namedetails.component.html',
  styleUrls: ['./namedetails.component.css']
})
export class NamedetailsComponent implements OnInit {
  code = '';
  name =  Detailsclass.initializeData()
  datalist:Detailsclass[] = []
  notifier: NotifierService;
  constructor(private firestore: AngularFirestore, private router: Router,private actRoute: ActivatedRoute,private spinner: NgxSpinnerService, notifierService: NotifierService) {
    this.notifier = notifierService; 
    console.log('initialize....')
    this.actRoute.params.subscribe((data)=> {
      var theid = data['name']
      this.code = theid

      this.firestore.collection('questions', ref => ref.where('code', '==', this.code))
  .snapshotChanges()
  .subscribe(
    (querySnapshot) => {
      const data: Detailsclass[] = querySnapshot.map((docChange) => {
        const id = docChange.payload.doc.id;
        const documentData = docChange.payload.doc.data();
        return Object.assign({ id }, documentData) as unknown as Detailsclass;
      });
      this.datalist = data;
      console.log(data, 'it is here...');
      // Further processing of the filtered and streamed data
    },
    (error) => {
      console.log('Error:', error);
    }
  );

    })
    

    }

    sendMessage(){     
      this.spinner.show()
      console.log('data', this.name.toMap())  
      const timestamp = Timestamp.now()
      const generatedUuid = uuidv4();
  
      this.firestore
      .collection('questions')          
      // .doc(this.dataId)
      .add({'code':this.code, 'question':this.name.question, "optiona":this.name.optiona, "optionb":this.name.optionb, "optionc":this.name.optionc, "optiond":this.name.optiond, "answer":this.name.answer})
      .then((docRef) => {
        this.spinner.hide()
        this.name.question = ''
        this.name.optiona = ''
        this.name.optionb = ''
        this.name.optionc = ''
        this.name.optiond = ''
        this.name.answer = ''
        this.notifier.notify('success', 'Question SAVED.')
        const id = docRef; // Get the generated document ID
        // console.log(id, 'response is here...');
        
      })
      
      .catch((error) =>{
        this.spinner.hide()
      })
      ;
  
    }
  ngOnInit(): void {
  }

}
