export class Leadershipclass {
    constructor(
        public code: string,        
        public email: string,        
        public nameID: string,
        public score: number,
    
        
    ) {
    }
    static initializeData(){
        return new Leadershipclass('', '', '', 0)
    }
    toMap(){
        return {'code':this.code, "email":this.email, "nameID":this.nameID, "score":this.score}
    }
    getObjects(data1: []){        
        var newdata = data1.map(
            data =>        
            new Leadershipclass(data['code'], data['email'], data['nameID'], data['score'])
        ) 
        return newdata
    }  
}
