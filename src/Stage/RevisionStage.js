const SessionStage = require("./SessionStage");
const SelectionStage = require("./SelectionStage");

class RevisionStage extends SessionStage{
    constructor(Session){
        super(Session);
    }

    closeStage(){
        let newStage = new SelectionStage(this._Session)
        this._Session.changeStage(newStage)
        return newStage
    }

    enterReview(paper, reviewer, review, score){
        if(this._Session.assigmentExistsFor(paper, reviewer)){
            if(paper.reviewExistsFor(reviewer)){
                throw new Error("El reviewer ya ingreso una review para este paper.");
            }
            else{
                paper.addReview(reviewer,review,score) 
            }           
        }
        else{
            throw new Error("Reviewer no autorizado.");
        }
        
    }
}

module.exports = RevisionStage;