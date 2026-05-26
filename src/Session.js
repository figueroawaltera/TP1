const {Bid, Interests} = require("./Bid");

class Session{
    constructor(){
        this._name = "";
        this._programCommittee=[];
        this._papers=[];
        this._bids=[];
        this._stage="Receiving";
        this._assignments=new Map();
    }
    name(){
        return this._name;
    };
    programCommittee(){
        return this._programCommittee;
    };
    reviewers(){
        return this._programCommittee;
    };
    addReviewer(user){
        this._programCommittee.push(user);
    }
    canSubmit(paper){
        if (this.stage() == "Receiving" )
            return paper.isValid();
        else 
            return false;
    }
    submit(paper){
        if (!this.canSubmit(paper)) throw new Error("Cannot submit invalid paper");
        
        if (this.stage() == "Receiving" )
            this._papers.push(paper);
        else
            throw new Error("Cannot submit papers at this stage");
    }
    papers(){
        return this._papers;
    }
    bids(){
        return this._bids;
    }
    stage(){
        return this._stage;
    }
    setStage(stage){
        this._stage = stage;
    }
    closeSubmissions(){
        this.setStage("Bidding");
    }
    enterBid(paper, reviewer, interest){
        if (this.stage() == "Bidding" )
            if(this.bidExistsFor(paper, reviewer)){
                let existing =  this.bidFor(paper, reviewer);
                existing.setInterest(interest);
            }
            else{
                let bid = new Bid(paper, reviewer, interest);
                this._bids.push(bid);
            }
        else
            throw new Error("Cannot enter bids from the current stage.");
    }
    bidExistsFor(paper, reviewer){
        return typeof(this.bidFor(paper, reviewer)) != "undefined";
    }
    bidFor(paper, reviewer){
        return this._bids.find( (suspect) => (suspect.paper() == paper) && (suspect.reviewer()==reviewer) );
    }
    interestFor(paper, reviewer){
        return this.bidFor(paper, reviewer).interest();
    }
    interestOrDefaultFor(paper, reviewer){
        if(this.bidExistsFor(paper, reviewer))
            return this.interestFor(paper, reviewer);
        return Interests.NotInterested;
    }
    interestPriority(interest){
        if(interest == Interests.Interested) return 2;
        if(interest == Interests.Maybe) return 1;
        return 0;
    }
    esAutor(paper, reviewer){
        return paper.authors().includes(reviewer);
    }
    asignarRevisores(){
        for(let i = 0; i < this._papers.length; i++){
            let paper = this._papers[i];
            let candidatos = [];
            for(let j = 0; j < this._programCommittee.length; j++){
                let reviewer = this._programCommittee[j];
                if(this.esAutor(paper, reviewer)) continue;
                let interest = this.interestOrDefaultFor(paper, reviewer);
                candidatos.push({reviewer: reviewer, priority: this.interestPriority(interest)});
            }
            candidatos.sort(function(a, b){ return b.priority - a.priority; });
            let asignados = [];
            for(let k = 0; k < 3; k++){
                asignados.push(candidatos[k].reviewer);
            }
            this._assignments.set(paper, asignados);
        }
    }
    revisoresAsignadosPara(paper){
        if(this._assignments.has(paper))
            return this._assignments.get(paper);
        return [];
    }
    calcularCargaDeRevisiones(totalArticulos, totalRevisores){
        let totalRevisiones = 3 * totalArticulos;
        let base = Math.floor(totalRevisiones / totalRevisores);
        let resto = totalRevisiones % totalRevisores;
        let carga = {};
        for (let i = 0; i < totalRevisores; i++){
            if (i < resto)
                carga[i] = base + 1;
            else
                carga[i] = base;
        }
        return carga;
    }
}

module.exports = Session;