const AcceptancePolicy = require("./AcceptancePolicy");

class AcceptanceByCount extends AcceptancePolicy {
    constructor(maxCount) {
        super();
        this._maxCount = maxCount;
    }

    maxCount() {
        return this._maxCount;
    }

    seleccionarArticulos(papers) {
        let ordenados = this.ordenarArticulosPorScore(papers);

        for (let i = 0; i < ordenados.length; i++) {
            if (i < this._maxCount) {
                ordenados[i].acceptPaper();
            } else {
                ordenados[i].declinePaper();
            }
        }

        return this.obtenerAceptados(papers);
    }
}

module.exports = AcceptanceByCount;
