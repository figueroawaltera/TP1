const SessionStage = require("./SessionStage");

class SelectionStage extends SessionStage{
    constructor(Session){
        super(Session);
    }

    obtenerArticulosOrdenadosPorScore(){
        let ordenados = [...this._Session.papers()];
        ordenados.sort(function(a, b){ return b.finalScore() - a.finalScore(); });
        return ordenados;
    }

    obtenerArticulosAceptados(){
        return this._Session.acceptancePolicy().seleccionarArticulos(this._Session.papers());
    }

}

module.exports = SelectionStage;
