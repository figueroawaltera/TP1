# ADR-005: Encapsular colecciones internas del dominio

## Estado

Propuesta.

## Contexto

Varias clases del dominio exponen directamente sus colecciones internas mediante métodos públicos.

Por ejemplo, `Session` expone colecciones como:

- `programCommittee()`
- `papers()`
- `bids()`
- `assignments()`

Y `Paper` expone:

- `authors()`
- `reviews()`

Cuando un método devuelve directamente el array interno, cualquier código externo puede modificar el estado del objeto sin pasar por las reglas del dominio. Por ejemplo, se podría agregar un artículo a una sesión sin respetar la etapa `ReceivingStage`, o agregar una revisión sin validar revisor asignado, score permitido o límite máximo de revisiones.

Esto debilita el encapsulamiento y permite romper invariantes del modelo.

## Decisión

Se propone encapsular las colecciones internas devolviendo copias defensivas desde los getters públicos.

Ejemplo:

```js
papers() {
    return [...this._papers];
}
```

Las modificaciones válidas deberían realizarse mediante métodos explícitos del dominio, por ejemplo:

```js
addPaper(paper) {
    this._papers.push(paper);
}

addReviewer(user) {
    this._programCommittee.push(user);
}

addBid(bid) {
    this._bids.push(bid);
}

addAssignment(assignment) {
    this._assignments.push(assignment);
}
```

Las clases de etapa deberían usar estos métodos en lugar de modificar directamente los arrays devueltos por los getters.

## Consecuencias

### Positivas

- Protege las invariantes del dominio.
- Evita modificaciones externas no controladas.
- Hace más explícitas las operaciones válidas sobre `Session` y `Paper`.
- Reduce el acoplamiento entre las etapas y la estructura interna de `Session`.

### Negativas

- Requiere modificar código existente que usa `.papers().push(...)`, `.bids().push(...)` o `.assignments().push(...)`.
- Algunos tests pueden necesitar ajustes si verifican o manipulan directamente las colecciones.

## Alternativas consideradas

### Mantener getters mutables

Se descartó porque permite saltear reglas del dominio.

### Usar `Object.freeze`

Podría aplicarse, pero devolver copias defensivas es más simple para el nivel actual del proyecto.

## Decisiones relacionadas

- ADR-001: Usar patrón State para modelar las etapas de una sesión.
- ADR-004: Refactorizar la asignación de revisores.
