const SessionStage = require("./SessionStage");
const BiddingStage = require("./BiddingStage");

class ReceivingStage extends SessionStage{
    constructor(Session){
        super(Session);
    }

    canSubmit(paper){
        return paper.isValid();
    }

    submit(paper){        
        if (!this.canSubmit(paper)) throw new Error("Cannot submit invalid paper");
        this._Session.papers().push(paper);
    }

    closeStage(){
        let newStage = new BiddingStage(this._Session)
        this._Session.changeStage(newStage)
        return newStage
    }
}

module.exports = ReceivingStage;