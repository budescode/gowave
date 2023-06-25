import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-gettoken',
  templateUrl: './gettoken.component.html',
  styleUrls: ['./gettoken.component.css']
})
export class GettokenComponent implements OnInit {
  // used as model for the frontend
  privatekey = ''
  accountid = ''
  // used as model for the frontend

  // gotten from firebase.
  myPrivateKey = ''
  myAccountId = ''
  notifier: NotifierService;

  constructor(private firestore: AngularFirestore, private spinner: NgxSpinnerService, notifierService: NotifierService) {
    this.notifier = notifierService; 
    this.getDetails()
  }


  ngOnInit(): void {
  }

  getDetails(){
    const email = localStorage.getItem('email');

// Get the userprofile document based on email
const query = this.firestore.collection('userprofile',  (ref) => ref.where('email', '==', email))
.snapshotChanges()
.subscribe(
  (querySnapshot) => {
  const data: any = querySnapshot.map((docChange) => {
    const id = docChange.payload.doc.id;
    const documentData = docChange.payload.doc.data();
    return Object.assign({ id }, documentData) as unknown;
  });
  console.log('there is data..', data)
  if(data!='' && data!=[]){
    console.log('there is data..', data)
    this.privatekey = data[0]['privateKey']
   this. accountid = data[0]['accountID']
  }else{
    this.privatekey  = ''
    this.accountid  = ''
  }
  console.log('the data is...', data)
  
},

);


  }
  async submitData(){
    if(this.accountid == '' 
    
    || this.privatekey == ''){
      this.notifier.notify('error', 'FIll all fields')
      return
    }
    const email = localStorage.getItem('email')
    await this.firestore.collection('userprofile').ref.where('email', '==', email).get().then(
      async (querySnapshot) => {
        if (!querySnapshot.empty) {        
          const docRef = querySnapshot.docs[0].ref;
          const id = docRef.id;          
          const userData = querySnapshot.docs[0].data() as any;
  const currentAccountID = userData['accountID'].toString();
  const currentPrivateKey = userData['privateKey'];
          // Update the userprofile document
          await docRef.update({
            'accountID': this.accountid,
            'privateKey': this.privatekey
          })
          this.notifier.notify('success', 'Successfully Updated!')
        } else {     
        
        var userdata = {'email':email, 'accountID':this.accountid, 'privateKey': this.privatekey}
          await  this.firestore
      .collection('userprofile')    
      .add(userdata)
      .then((docRef) => {
        const id = docRef.id; // Get the generated document ID
        console.log(id, 'response is here...');
        this.notifier.notify('success', 'Successfully Updated!')
        this.spinner.hide()

        // this.router.navigate(['/dashboard']);
      })    
      .catch((error) =>{
        this.spinner.hide()
      });
  
        } //else
      },
      (error) => {
        console.log('Error getting documents:', error);
        this.spinner.hide()
      }
    );
  }
}
