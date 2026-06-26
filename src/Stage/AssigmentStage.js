const SessionStage = require("./SessionStage");
const RevisionStage = require("./RevisionStage");
const Assigment = require("../Assigment");
const {Interests} = require("../Bid");

class AssigmentStage extends SessionStage{
    constructor(Session){
        super(Session);
    }

    closeStage(){
        let newStage = new RevisionStage(this._Session)
        this._Session.changeStage(newStage)
        return newStage
    }

    enterAssigment(paper, reviewer){
        if (!this._Session.assigmentExistsFor(paper, reviewer)){
            let asignacion = new Assigment(paper, reviewer);
            let asignaciones = this._Session.assignments()
            asignaciones.push(asignacion);
        }
        else throw new Error("Asignación ya existe para el par (paper,reviewer) ingresado.");        
    }

    interestPriority(interest){
        if(interest == Interests.Interested) return 2;
        if(interest == Interests.Maybe) return 1;
        return 0;
    }

    asignarRevisores(){
        for(let i = 0; i < this._Session.papers().length; i++){
            let paper = this._Session.papers()[i];
            let candidatos = [];
            for(let j = 0; j < this._Session.programCommittee().length; j++){
                let reviewer = this._Session.programCommittee()[j];
                if(paper.esAutor(reviewer)) continue;
                let interest = this._Session.interestOrDefaultFor(paper, reviewer);
                candidatos.push({reviewer: reviewer, priority: this.interestPriority(interest)});
            }
            candidatos.sort(function(a, b){ return b.priority - a.priority; });

            for(let k = 0; k < 3; k++){
                this.enterAssigment(paper,candidatos[k].reviewer)
            }
        }
        
    }
}

module.exports = AssigmentStage;