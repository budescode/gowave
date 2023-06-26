import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { Createclass } from '../classes/createclass';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { Client, PrivateKey, AccountId, TokenCreateTransaction, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction, FileCreateTransaction, ContractCreateTransaction, ContractExecuteTransaction, ContractFunctionParameters, ContractCallQuery } from "@hashgraph/sdk";

@Component({
  selector: 'app-dashboardhost',
  templateUrl: './dashboardhost.component.html',
  styleUrls: ['./dashboardhost.component.css']
})
export class DashboardhostComponent implements OnInit {


  listdata:Createclass[] = []
  
  name =  Createclass.initializeData()
  notifier: NotifierService;
  accountId = ''
  privateKey = ''
  
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
          const userData = querySnapshot.docs[0].data() as any;
          const currentAccountID = userData['accountID'].toString();
          const currentPrivateKey = userData['privateKey'];
          this.accountId = currentAccountID
          this.privateKey = currentPrivateKey
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

  async  sendMessage(){    
    console.log(this.accountId, this.privateKey, 'account and private keu..')
    if(this.name.name == ''|| this.name.description == '' || this.name.rewardhbar == ''){
      this.notifier.notify('error', 'FIll all fields')
      return;
    }  
    if(this.name.rewardhbar == 'Yes'&& this.name.hbaramount == ''){
      this.notifier.notify('error', 'Enter Hbar amount')
      return;
    }    
    this.spinner.show()
    var newAccountId = ''
    if(this.name.rewardhbar == 'Yes'){
      newAccountId = await this.createHederaAccount().toString()
    }
    
    const timestamp = Timestamp.now()
    const email = localStorage.getItem('email')
    const generatedUuid = uuidv4();
    const code = this.generateRandomCode()
    this.firestore
    .collection('name')    
    .add({ 'newAccountId':newAccountId, 'rewardhbar':this.name.rewardhbar, 'hbaramount':this.name.hbaramount, 'name':this.name.name, 'description':this.name.description, 'createdAt':timestamp, 'uuid':generatedUuid, 'code':code, 'start':false, 'end':false, 'currentId':'', 'email': email})
    .then((docRef) => {
      this.spinner.hide()
      const id = docRef.id; // Get the generated document ID
      console.log(id, 'response is here...');
      this.router.navigate(['/details', code]);
    })    
    .catch((error) =>{
      this.spinner.hide()
    });

  }

  async createHederaAccount(){
  console.log('step 1...')
    const myAccountId = AccountId.fromString(this.accountId.toString());
    const myPrivateKey = PrivateKey.fromString(this.privateKey.toString());
    console.log('step 2...')
    var client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);
    console.log('creating account..')
        
    client.setOperator(myAccountId, myPrivateKey);  
    const newAccountPrivateKey = PrivateKey.generateED25519(); 
    const newAccountPublicKey = newAccountPrivateKey.publicKey;
    const seedPhrase = newAccountPrivateKey.toStringRaw();
    console.log(seedPhrase, 'okay...')

    //Create a new account with 1,000 tinybar starting balance
    const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(this.name.hbaramount))
    

    .execute(client);

    // Get the new account ID
      const getReceipt = await newAccount.getReceipt(client);
      const newAccountId = getReceipt.accountId;

      //Log the account ID
      console.log("The new account ID is: " +newAccountId, 'with private key is..', newAccountPrivateKey._key, 'public key is', newAccountPublicKey._key);

      //Verify the account balance
      const accountBalance = await new AccountBalanceQuery()
          .setAccountId(newAccountId!)
          .execute(client);
          console.log("The new account balance is: " +accountBalance.hbars +" tinybar.");
      return newAccountId!.toString()

      
  }

  ngOnInit(): void {
  }

}
 