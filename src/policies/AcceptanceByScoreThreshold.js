const AcceptancePolicy = require("./AcceptancePolicy");

class AcceptanceByScoreThreshold extends AcceptancePolicy {
    constructor(threshold) {
        super();
        this._threshold = threshold;
    }

    threshold() {
        return this._threshold;
    }

    seleccionarArticulos(papers) {
        for (let i = 0; i < papers.length; i++) {
            if (papers[i].finalScore() >= this._threshold) {
                papers[i].acceptPaper();
            } else {
                papers[i].declinePaper();
            }
        }

        return this.obtenerAceptados(papers);
    }
}

module.exports = AcceptanceByScoreThreshold;
