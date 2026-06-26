class AcceptancePolicy {
    seleccionarArticulos(papers) {
        throw new Error("Método abstracto: debe ser implementado por la subclase");
    }

    ordenarArticulosPorScore(papers) {
        let ordenados = [...papers];
        ordenados.sort(function(a, b) {
            let diff = b.finalScore() - a.finalScore();
            return diff !== 0 ? diff : 0;
        });
        return ordenados;
    }

    obtenerAceptados(papers) {
        return papers.filter(function(p) { return p.isAccepted() === true; });
    }
}

module.exports = AcceptancePolicy;
