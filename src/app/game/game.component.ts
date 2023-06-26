import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { Createclass } from '../classes/createclass';
import { Detailsclass } from '../classes/detailsclass';
import { Leadershipclass } from '../classes/leadershipclass';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  dataId = '';
  docId = '' //the id from firebase
  name =  Detailsclass.initializeData()
  
  questiondata:Createclass | undefined;
  start = false;
  end = false;
  countdown = 10;
  datalist:Detailsclass[] = []
  index = 0; //this will be changed along with the data list.
  leadershipList:Leadershipclass[] = []
  notifier: NotifierService;

  constructor(private firestore: AngularFirestore, private router: Router,private actRoute: ActivatedRoute, private spinner: NgxSpinnerService, notifierService: NotifierService) {
    this.notifier = notifierService; 
    
    console.log('initialize....')
    this.actRoute.params.subscribe((data)=> {
      var theid = data['name']
      this.dataId = theid
///////////////////get  game code data
      this.firestore.collection('name', ref => ref.where('code', '==', this.dataId))
  .snapshotChanges()
  .subscribe(
    (querySnapshot) => {
      console.log('the qyeerys hot us,,', querySnapshot)
      if(querySnapshot.length == 0){

        console.log('it is not there..')
        this.notifier.notify('error', 'Data not found!')
        
        this.router.navigate(['/dashboard/hostgame'])
        return Createclass.initializeData();
  }
      const data: Createclass[]   = querySnapshot.map((docChange) => {

      
        const id = docChange.payload.doc.id;
        var responsedata:any = docChange.payload.doc.data()
        var start = responsedata['start']
        var end = responsedata['end']
        this.start = start
        this.end = end
        
        // get the list of questions once if it has not been gotten before.
        if(this.docId==''){
          this.docId = id
          console.log('doc id is..', this.docId)
          this.actRoute.params.subscribe((data) => {
            
            const theid = data['name'];
            this.dataId = theid;          
            this.firestore
              .collection('questions', (ref) => ref.where('code', '==', this.dataId))
              .get()
              .subscribe((querySnapshot) => {
                const data: Detailsclass[] = querySnapshot.docs.map((doc) => {
                  const id = doc.id;
                  const documentData = doc.data();
                  return Object.assign({ id }, documentData) as unknown as Detailsclass;
                });
                this.datalist = data;
                console.log(this.datalist, 'it the questions is here...');
                // Further processing of the retrieved data
              });
          });          
        }

        const documentData = docChange.payload.doc.data();
        return Object.assign({ id }, documentData) as unknown as Createclass;
      });
      this.questiondata  = data[0]
      
      return [];
      // Further processing of the filtered and streamed data
    },
    (error) => {
      console.log('Error:', error);
    }
  );
  ///////////////////get  game code data

////////////get leadership board/////////////////////////
  this.firestore
  .collection('leadershipboard', (ref) => ref.where('code', '==', this.dataId).orderBy('score', 'desc')              
  ).snapshotChanges()
  .subscribe((querySnapshot) => {
    const data: Leadershipclass[] = querySnapshot.map((docChange) => {
      const id = docChange.payload.doc.id;
      const documentData = docChange.payload.doc.data();
      return Object.assign({ id }, documentData) as unknown as Leadershipclass;
    });
    this.leadershipList = data;
  },
  ////////////get leadership board/////////////////////////

  );

    })
  }


  async updateGame(data:{}){
    await this.firestore.collection('name').doc(this.docId).update(data)
        .then(() => {
          console.log('Field updated successfully');
        })
        .catch((error: any) => {
          console.error('Error updating field:', error);
        });
  }

countdownTImer(){
  const timer = setInterval(() => {
    console.log(this.countdown);
    this.countdown--;
  
    if (this.countdown <= 0) {
      clearInterval(timer);
      console.log('Countdown finished  and getting next question!');
      this.getNextQuestion();

    }
  }, 1000);  
}

async startGame(){
  this.index = 0
  this.start = true  
  await this.updateGame({'start':true});
  
  
  console.log('staryed...')  
    
    this.questiondata!.question = this.datalist[this.index].question
    this.questiondata!.optiona = this.datalist[this.index].optiona
    this.questiondata!.optionb = this.datalist[this.index].optionb
    this.questiondata!.optionc = this.datalist[this.index].optionc
    this.questiondata!.optiond = this.datalist[this.index].optiond
    this.questiondata!.answer = this.datalist[this.index].answer
    this.questiondata!.nameID = this.datalist[this.index].nameID
    console.log('updating initial question')
    this.updateGame({'question':this.questiondata!.question, 'optiona':this.questiondata!.optiona ,'optionb':this.questiondata!.optionb, 'optionc':this.questiondata!.optionc, 'optiond':this.questiondata!.optiond, 'answer':this.questiondata!.answer});
    this.countdown = 10
    this.countdownTImer()
    console.log({'question':this.questiondata!.question, 'optiona':this.questiondata!.optiona ,'optionb':this.questiondata!.optionb, 'optionc':this.questiondata!.optionc, 'optiond':this.questiondata!.optiond, 'answer':this.questiondata!.answer})
    
    
      
}

async getNextQuestion()  {  
  console.log(this.questiondata?.nameID, this.index, 'the index and namedata..,,..')



  if (this.index < this.datalist.length) {
    // The index is valid
    try{
      this.index = this.index + 1
      this.questiondata!.question = this.datalist[this.index].question
      this.questiondata!.optiona = this.datalist[this.index].optiona
      this.questiondata!.optionb = this.datalist[this.index].optionb
      this.questiondata!.optionc = this.datalist[this.index].optionc
      this.questiondata!.optiond = this.datalist[this.index].optiond
      this.questiondata!.answer = this.datalist[this.index].answer
      this.questiondata!.nameID = this.datalist[this.index].nameID
      console.log('updating questuib,')
      console.log({'question':this.questiondata!.question, 'optiona':this.questiondata!.optiona ,'optionb':this.questiondata!.optionb, 'optionc':this.questiondata!.optionc, 'optiond':this.questiondata!.optiond, 'answer':this.questiondata!.answer})
      await this.updateGame({'question':this.questiondata!.question, 'optiona':this.questiondata!.optiona ,'optionb':this.questiondata!.optionb, 'optionc':this.questiondata!.optionc, 'optiond':this.questiondata!.optiond, 'answer':this.questiondata!.answer});
      this.countdown = 10
      this.countdownTImer()
    }catch(e){
      console.log(e, 'error')
      await  this.updateGame({'end':true,});
      this.countdown = 10
      this.end = true
    }

    
  } else {
    // The index is out of bounds so endgame
    await  this.updateGame({'end':true,});
    this.countdown = 10
    this.end = true
    return

  


}

}
  ngOnInit(): void {
  }

}
 