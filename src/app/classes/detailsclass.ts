export class Detailsclass {
    constructor(
        public question: string,        
        public optiona: string,
        public optionb: string,
        public optionc: string,
        public optiond: string,
        public answer: string,
        public nameID: string,
        
    ) {
    }
    static initializeData(){
        return new Detailsclass('', '', '', '', '', '', '')
    }
    toMap(){
        return {'question':this.question, "optiona":this.optiona, "optionb":this.optionb, "optionc":this.optionc, "optiond":this.optiond, "answer":this.answer, "nameID":this.nameID}
    }
    getObjects(data1: []){        
        var newdata = data1.map(
            data =>        
            new Detailsclass(data['question'], data['optiona'], data['optionb'], data['optionc'], data['optiond'], data['answer'], data['nameID'])
        ) 
        return newdata
    }  
}
