import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthProvider, User } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { connectToMetamask } from '../services/metamaskService';
import { Client, PrivateKey, AccountId, TokenCreateTransaction, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction, FileCreateTransaction, ContractCreateTransaction, ContractExecuteTransaction, ContractFunctionParameters, ContractCallQuery } from "@hashgraph/sdk";
import { sendHbar } from '../services/hederaService';
// require ("dotenv").config()


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayname: string | null = null 
  displayEmail: string | null  = null
  code:any
  MY_ACCOUNT_ID = '0.0.14222189'
  MY_PRIVATE_KEY:string = '3030020100300706052b8104000a042204200169659a274ab04a4720bf8acdc0b7a88e781597e94bcd38755f334e087d1de0'
  myAccountId = AccountId.fromString(this.MY_ACCOUNT_ID);
  myPrivateKey = PrivateKey.fromString(this.MY_PRIVATE_KEY);
  client:any;

  sendaddress = '';
  constructor(private router: Router,public authService: AuthService,  public afAuth: AngularFireAuth ) {   
  this.displayname = localStorage.getItem('displayName')
  this.displayEmail= localStorage.getItem('email')

// if (!process.env['MY_ACCOUNT_ID'] || !process.env['MY_PRIVATE_KEY']) {
//   throw new Error("Environment variables REACT_APP_MY_ACCOUNT_ID and REACT_APP_MY_PRIVATE_KEY must be present");
// }

// create your client


this.client = Client.forTestnet();
this.client.setOperator(this.myAccountId, this.myPrivateKey);

  }

  async connectMetaMaskAcc(){
   const addresses = await connectToMetamask()
   console.log('the address is...', addresses[0]);
  }
  
  async createAccount(){
    console.log('creating account..')
    const client = Client.forTestnet();    
    client.setOperator(this.myAccountId, this.myPrivateKey);  
    const newAccountPrivateKey = PrivateKey.generateED25519(); 
    const newAccountPublicKey = newAccountPrivateKey.publicKey;
    const seedPhrase = newAccountPrivateKey.toStringRaw();
    console.log(seedPhrase, 'okay...')

    //Create a new account with 1,000 tinybar starting balance
    const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    

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

      console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");
  }


  async transferHBAR(myAccountId: string, newAccountId:string, client: Client){
    //Create the transfer transaction
      const sendHbar = await new TransferTransaction()
      .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000)) //Sending account
      .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000)) //Receiving account
      .execute(client);

      //Verify the transaction reached consensus
      const transactionReceipt = await sendHbar.getReceipt(client);
      console.log("The transfer transaction from my account to the new account was: " + transactionReceipt.status.toString());

  }

  async getAccountBalance(newAccountId:string, client:Client){
    //Check the new account's balance
    const getNewBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

    console.log("The account balance after the transfer is: " +getNewBalance.hbars.toTinybars() +" tinybar.")
  }
  sendHBARToken(){
    const MY_ACCOUNT_ID = '0.0.14222189'
    const MY_PRIVATE_KEY:string = '3030020100300706052b8104000a042204200169659a274ab04a4720bf8acdc0b7a88e781597e94bcd38755f334e087d1de0'
    const myAccountId = AccountId.fromString(this.MY_ACCOUNT_ID);
    const myPrivateKey = PrivateKey.fromString(this.MY_PRIVATE_KEY);
    const client = Client.forTestnet();
    client.setOperator(this.myAccountId, this.myPrivateKey);    
    console.log('sending hbar to', this.sendaddress)
    sendHbar(client, myAccountId, this.sendaddress, 100, myPrivateKey)
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
