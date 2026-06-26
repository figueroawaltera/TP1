const SessionStage = require("./SessionStage");
const AssigmentStage = require("./AssigmentStage");
const {Bid, Interests} = require("../Bid");

class BiddingStage extends SessionStage{
    constructor(Session){
        super(Session);
    }

    closeStage(){
        let newStage = new AssigmentStage(this._Session)
        this._Session.changeStage(newStage)
        return newStage
    }

    enterBid(paper, reviewer, interest){
        if(this._Session.bidExistsFor(paper, reviewer)){
            let existing =  this._Session.bidFor(paper, reviewer);
            existing.setInterest(interest);
        }
        else{
            let bid = new Bid(paper, reviewer, interest);
            this._Session.bids().push(bid);
        }
        
    }
}

module.exports = BiddingStage;