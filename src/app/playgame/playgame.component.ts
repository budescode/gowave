import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { ActivatedRoute, Router } from '@angular/router';
import { Createclass } from '../classes/createclass';
import { Detailsclass } from '../classes/detailsclass';
import { Leadershipclass } from '../classes/leadershipclass';

@Component({
  selector: 'app-game',
  templateUrl: './playgame.component.html',
  styleUrls: ['./playgame.component.css']
})
export class PlaygameComponent implements OnInit {
  code = '';
  docId = '' //the id from firebase
  name =  Detailsclass.initializeData()
  
  questiondata:Createclass | undefined;
  start = false;
  end = false;
  countdown = 0;
  datalist:Detailsclass[] = []
  leadershipList:Leadershipclass[] = []
  mydetails:Leadershipclass | undefined;  
  index = 0; //this will be changed along with the data list.
  answered = false; // will be true when they have answeed a question
  timer :any; // Global variable



  constructor(private firestore: AngularFirestore, private router: Router,private actRoute: ActivatedRoute,) { 
    const myemail = localStorage.getItem('email')
    if(myemail == null){
      ///redirect
    }
    console.log('initialize....')
    this.actRoute.params.subscribe((data)=> {
      var theid = data['name']
      this.code = theid
      console.log('qZAPp5shX35w9OXhyvXq', this.code)
      this.getOrCreateUser(myemail!, this.code)

///////////////////get  game code data
  this.firestore.collection('name', ref => ref.where('code', '==', this.code))
  .snapshotChanges()
  .subscribe(
    (querySnapshot) => {
      const data: Createclass[]   = querySnapshot.map((docChange) => {
        const id = docChange.payload.doc.id;
        console.log(docChange.payload.doc, 'the final data....')
        // get the list of questions once if it has not been gotten before.
        // if(this.docId==''){
          //////////////////////get the game name data////////////////////
          this.docId = id
          console.log('doc id is..', this.docId)
          this.actRoute.params.subscribe((data) => {
            const theid = data['name'];
            this.code = theid;   
            const documentData = docChange.payload.doc.data();
            var data1 =  Object.assign({ id }, documentData) as unknown as Createclass;
            this.questiondata  = data1;
            console.log(data1.start, 'if it is started or not')
            this.answered = false;
            if(this.questiondata?.start == true && this.questiondata?.end == false){
              this.countdown = 10
              this.stopTimer()
            this.countdownTimer()
            this.start = true
            }
            //////////////////////end get the game name data////////////////////
            
            
            ////////////////////// get the questions data////////////////////
            this.firestore
              .collection('questions', (ref) => ref.where('nameID', '==', this.docId))
              .get()
              .subscribe((querySnapshot) => {
                const data: Detailsclass[] = querySnapshot.docs.map((doc) => {
                  const id = doc.id;
                  const documentData = doc.data();
                  return Object.assign({ id }, documentData) as unknown as Detailsclass;
                });
                this.datalist = data;
                // console.log(this.datalist, 'it the questions is here...');
                
                
                
              });
              ////////////////////// end get the questions data////////////////////

          });          
        // }

        const documentData = docChange.payload.doc.data();
        return Object.assign({ id }, documentData) as unknown as Createclass;
      });
      
      // Further processing of the filtered and streamed data
    },
    (error) => {
      console.log('Error:', error);
    }
  );

  //////////////////////////////////get my user..//////////////////////////////////
  this.firestore
  .collection('leadershipboard', (ref) => ref.where('code', '==', this.code).where('email', '==', myemail)
  ).snapshotChanges()
  
  .subscribe((querySnapshot) => {
    const data: Leadershipclass[] = querySnapshot.map((docChange) => {
      const id = docChange.payload.doc.id;
      const documentData = docChange.payload.doc.data();
      return Object.assign({ id }, documentData) as unknown as Leadershipclass;
    });
    // this.listdata = data;
    console.log(data, 'my details is here...');
      if(data!=[]){
      this.mydetails = data[0];
     }else{
      
     }
    // Further processing of the filtered and streamed data
  },

  );

  ///////////////////end leadershhip board..////////////////////
       this.firestore
              .collection('leadershipboard', (ref) => ref.where('code', '==', this.code).orderBy('score', 'desc')              
              ).snapshotChanges()
              .subscribe((querySnapshot) => {
                const data: Leadershipclass[] = querySnapshot.map((docChange) => {
                  const id = docChange.payload.doc.id;
                  const documentData = docChange.payload.doc.data();
                  return Object.assign({ id }, documentData) as unknown as Leadershipclass;
                });
                this.leadershipList = data;
              },
            
              );

         
      ////////////////////////////


    })
  }

submitAnswer(option:string){
  this.answered = true;
  
  var timevalue = this.countdown;
  var point = 0;
  if(this.questiondata?.answer == option){
    var point = 5
  } 
  var currentScore = this.mydetails!=undefined? this.mydetails.score : 0
  var score =  (point * timevalue) + currentScore 
  console.log('this is my score..', score)
  this.updateScore(score)
  this.stopTimer()

}
updateScore(val:number){
  console.log('Uplaoding score..')
const email =localStorage.getItem('email');
const code = this.code;
const newScore = val;
// const scoreRef = this.firestore.collection('leadershipboard');
this.firestore
.collection('leadershipboard', (ref) => ref.where('email', '==', email) .where('code', '==', code).orderBy('score', 'desc'))
  .get()
  .subscribe((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const scoreRef = this.firestore.collection('leadershipboard');
      const docRef = scoreRef.doc(doc.id);
      docRef.update({ score: newScore })
        .then(() => {
          console.log('Score updated successfully!');
        })
        .catch((error) => {
          console.error('Error updating score:', error);
        });
    }); 
  });
}
getOrCreateUser(email:string, code:string){
  console.log('getting the user data')
  this.firestore.collection('leadershipboard').ref.where('email', '==', email) .where('code', '==', code).get().then(
    (querySnapshot) => {
      if (!querySnapshot.empty) {
        const document = querySnapshot.docs[0];
        const documentData = document.data();
        const documentId = document.id;
        console.log(documentData, 'it is here...');
        console.log('USER ID:', documentId);
      
      } else {
        console.log('No matching documents found.');

        console.log('creating user...')
      //// create new user
      var userdata = {'email':email, 'code':this.code, 'score':0}
          this.firestore
    .collection('leadershipboard')    
    .add(userdata)
    .then((docRef) => {
      const id = docRef.id; // Get the generated document ID
      // console.log(id, 'response is here...');
      // this.router.navigate(['/details', id]);
    })    
    .catch((error) =>{
      
    });

      } //else
    },
    (error) => {
      console.log('Error getting documents:', error);
    }
  );
}


  getRefByCode(code:string){
    this.firestore.collection('name').ref.where('code', '==', code).get().then(
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const document = querySnapshot.docs[0];
          const documentData = document.data();
          const documentId = document.id;
          console.log(documentData, 'it is here...');
          console.log('Document ID:', documentId);
          this.router.navigate(['/details', documentId]);
        } else {
          console.log('No matching documents found.');
        }
      },
      (error) => {
        console.log('Error getting documents:', error);
      }
    );
  }

countdownTimer() {
  this.countdown = 10;
  this.timer = setInterval(() => {
    console.log(this.countdown);
    this.countdown--;
  
    if (this.countdown <= 0) {
      this.stopTimer();
      this.countdown = 0;
      console.log('Countdown finished and getting next question!');
      // this.getNextQuestion();
    }
  }, 1000);
}

stopTimer() {
  clearInterval(this.timer);
}

// async startGame(){
//   this.index = 0
//   this.start = true  
//   await this.updateGame({'start':true});
  
//   console.log('staryed...')  
    
//     this.questiondata!.question = this.datalist[this.index].question
//     this.questiondata!.optiona = this.datalist[this.index].optiona
//     this.questiondata!.optionb = this.datalist[this.index].optionb
//     this.questiondata!.optionc = this.datalist[this.index].optionc
//     this.questiondata!.optiond = this.datalist[this.index].optiond
//     this.questiondata!.answer = this.datalist[this.index].answer
//     this.questiondata!.nameID = this.datalist[this.index].nameID
//     console.log('updating initial question')
//     this.updateGame({'question':this.questiondata!.question, 'optiona':this.questiondata!.optiona ,'optionb':this.questiondata!.optionb, 'optionc':this.questiondata!.optionc, 'optiond':this.questiondata!.optiond, 'answer':this.questiondata!.answer});
//     this.countdown = 10
//     this.countdownTImer()
//     console.log({'question':this.questiondata!.question, 'optiona':this.questiondata!.optiona ,'optionb':this.questiondata!.optionb, 'optionc':this.questiondata!.optionc, 'optiond':this.questiondata!.optiond, 'answer':this.questiondata!.answer})
    
    
      
// }

// async getNextQuestion()  {  
//   console.log(this.questiondata?.nameID, this.index, 'the index and namedata..,,..')



//   if (this.index < this.datalist.length) {
//     // The index is valid
//     this.index = this.index + 1
//     this.questiondata!.question = this.datalist[this.index].question
//     this.questiondata!.optiona = this.datalist[this.index].optiona
//     this.questiondata!.optionb = this.datalist[this.index].optionb
//     this.questiondata!.optionc = this.datalist[this.index].optionc
//     this.questiondata!.optiond = this.datalist[this.index].optiond
//     this.questiondata!.answer = this.datalist[this.index].answer
//     this.questiondata!.nameID = this.datalist[this.index].nameID
//     console.log('updating questuib,')
//     console.log({'question':this.questiondata!.question, 'optiona':this.questiondata!.optiona ,'optionb':this.questiondata!.optionb, 'optionc':this.questiondata!.optionc, 'optiond':this.questiondata!.optiond, 'answer':this.questiondata!.answer})
//     await this.updateGame({'question':this.questiondata!.question, 'optiona':this.questiondata!.optiona ,'optionb':this.questiondata!.optionb, 'optionc':this.questiondata!.optionc, 'optiond':this.questiondata!.optiond, 'answer':this.questiondata!.answer});
//     this.countdown = 10
//     this.countdownTImer()
//     return
//   } else {
//     // The index is out of bounds so endgame
//     await  this.updateGame({'end':true});
//     this.countdown = 10
//     this.end = true
//     return

  


// }

// }
  ngOnInit(): void {
  }

}
 