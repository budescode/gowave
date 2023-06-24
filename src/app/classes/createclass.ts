export class Createclass {
    constructor(
        public name: string,        
        public description: string,
        public start: boolean,
        public end: boolean,
        public code: string,
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
        return new Createclass('', '', false, false, '', '', '', '', '', '', '', '')
    }
    toMap(){
        return {'name':this.name, "description":this.description}
    }
}
