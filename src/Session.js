const {Bid, Interests} = require("./Bid");
const Assigment = require("./Assigment");
const Review = require("./Review");

class Session{
    constructor(){
        this._name = "";
        this._programCommittee=[];
        this._papers=[];
        this._bids=[];
        this._stage="Receiving";
        this._assignments=[];
        this._acceptancePercentage=0;
    }
    name(){
        return this._name;
    };

    acceptancePercentage(){
        return this._acceptancePercentage;
    }

    setAcceptancePercentage(percentage){
        if (percentage < 0 || percentage > 100)
            throw new Error("El porcentaje de aceptación debe estar entre 0 y 100.");
        this._acceptancePercentage = percentage;
    }
    
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

    assigmentsPapers(paper){
        let nCantAssigment = 0
        for(let i = 0; i < this._assignments.length; i++){
            if (this._assignments[i].paper() == paper) nCantAssigment += 1
        }
        return nCantAssigment
    }
    
    setStage(stage){
        this._stage = stage;
    }
    
    closeSubmissions(){
        this.setStage("Bidding");
    }

    closeBidding(){
        this.setStage("Assigment")
    }

    closeAssigment(){
        this.setStage("Revision")
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
    
    enterAssigment(paper, reviewer){
        if (!this.assigmentExistsFor(paper, reviewer)){
            let asignacion = new Assigment(paper, reviewer);
            this._assignments.push(asignacion);
            }
            else
                throw new Error("Asignación ya existe para el par (paper,reviewer) ingresado.");
    }
    
    assigmentExistsFor(paper, reviewer){
        return typeof(this.assigmentFor(paper, reviewer)) != "undefined";
    }

    assigmentFor(paper, reviewer){
        return this._assignments.find( (suspect) => (suspect.paper() == paper) && (suspect.reviewer()==reviewer) );
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
                this.enterAssigment(paper,candidatos[k].reviewer)
            }
        }
    }

    calcularCargaDeRevisiones(){
        let totalArticulos = this.papers().length
        let totalRevisores = this.programCommittee().length
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
    
    enterReview(paper, reviewer, review, score){
        if (this.stage() == "Revision" )
            if(this.assigmentExistsFor(paper, reviewer)){
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
        else
            throw new Error("Cannot enter review from the current stage.");
    }

    obtenerArticulosOrdenadosPorScore(){
        let ordenados = [...this._papers];
        ordenados.sort(function(a, b){ return b.score() - a.score(); });
        return ordenados;
    }
}

module.exports = Session;