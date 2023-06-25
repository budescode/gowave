import { Injectable } from '@angular/core';
import { GoogleAuthProvider, User } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { Client, PrivateKey, AccountId, TokenCreateTransaction, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction, FileCreateTransaction, ContractCreateTransaction, ContractExecuteTransaction, ContractFunctionParameters, ContractCallQuery } from "@hashgraph/sdk";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User | any;
  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service,
    private firestore: AngularFirestore, 
    private router: Router,
    private spinner: NgxSpinnerService,
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
        this.afAuth.currentUser.then(async (e)=>{
          console.log(e, 'okay oo..')
          
          if(e?.email!=null){
           await  this.getOrCreateUserProfile(e!.email.toString())
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

  async getOrCreateUserProfile(email:string,){
    this.spinner.show()
    console.log('getting the user data')
    await this.firestore.collection('userprofile').ref.where('email', '==', email).get().then(
      async (querySnapshot) => {
        if (!querySnapshot.empty) {
          const document = querySnapshot.docs[0];
          const documentData = document.data();
          const documentId = document.id;
          console.log(documentData, 'it is here...');
          console.log('USER ID:', documentId);
          this.spinner.hide()
        this.router.navigate(['/dashboard']);
        
        } else {
          console.log('No matching documents found.');
  
          console.log('creating user...')
        //// create new user
        const hederaAcc = await this.createHederaAccount()
        var userdata = {'email':email, 'accountID':hederaAcc[0], 'privateKey': hederaAcc[2]}
          await  this.firestore
      .collection('userprofile')    
      .add(userdata)
      .then((docRef) => {
        const id = docRef.id; // Get the generated document ID
        console.log(id, 'response is here...');
        this.spinner.hide()
        this.router.navigate(['/dashboard']);
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
    this.spinner.hide()
  }

  async createHederaAccount(){
    const MY_ACCOUNT_ID = '0.0.14222189'
    const MY_PRIVATE_KEY:string = '3030020100300706052b8104000a042204200169659a274ab04a4720bf8acdc0b7a88e781597e94bcd38755f334e087d1de0'
    const myAccountId = AccountId.fromString(MY_ACCOUNT_ID);
    const myPrivateKey = PrivateKey.fromString(MY_PRIVATE_KEY);

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
    .setInitialBalance(Hbar.fromTinybars(0))
    

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
      return [newAccountId!.toString(), accountBalance.hbars, newAccountPrivateKey.toStringRaw()]

      
  }

}