# ADR-004: Refactorizar la asignación de revisores

## Estado

Propuesta.

## Contexto

La asignación de revisores se realiza durante la etapa de asignación. El método actual recorre artículos, obtiene candidatos, excluye autores, calcula prioridad según el bid y asigna los tres primeros candidatos.

Esta lógica concentra varias responsabilidades en un único método:

- Recorrer los artículos de la sesión.
- Determinar revisores candidatos.
- Excluir autores para evitar conflictos de interés.
- Traducir intereses de bidding a prioridades numéricas.
- Ordenar candidatos.
- Crear asignaciones.

Además, la implementación asume que siempre existen al menos tres candidatos válidos para cada artículo. Si hubiera menos candidatos, podría producirse un error al intentar acceder a un candidato inexistente.

## Decisión

Se propone refactorizar la asignación de revisores separando el algoritmo en métodos más pequeños y expresivos.

La etapa de asignación debería mantener la responsabilidad del proceso, pero delegar partes internas en métodos auxiliares:

```js
asignarRevisores() {
    this._Session.papers().forEach(paper => {
        this.candidatosPara(paper)
            .slice(0, Paper.allowedReviews)
            .forEach(candidato => this.enterAssignment(paper, candidato.reviewer));
    });
}
```

Métodos sugeridos:

- `candidatosPara(paper)`: obtiene revisores que no son autores del artículo.
- `prioridadPara(paper, reviewer)`: calcula prioridad según el bid o interés por defecto.
- `ordenarPorPrioridad(candidatos)`: ordena candidatos de mayor a menor prioridad.
- `asignarCandidatos(paper, candidatos)`: registra las asignaciones necesarias.

También se recomienda reemplazar el valor literal `3` por `Paper.allowedReviews`.

## Consecuencias

### Positivas

- El algoritmo queda más legible y fácil de testear.
- Se reduce el riesgo de errores por falta de candidatos.
- La regla de cantidad de revisores queda alineada con la constante del dominio.
- Facilita incorporar criterios futuros, como balance de carga de revisiones.

### Negativas

- La clase de etapa tendrá más métodos internos.
- Puede requerir ajustar tests si se renombran métodos públicos relacionados con `Assigment`.

## Refactoring futuro relacionado

Existe un método `calcularCargaDeRevisiones()` que calcula la carga esperada por revisor. Como mejora posterior, el algoritmo de asignación debería considerar esa carga para evitar concentrar demasiadas revisiones en un mismo usuario.

## Decisiones relacionadas

- ADR-001: Usar patrón State para modelar las etapas de una sesión.
- ADR-003: Centralizar reglas de score y límites de revisión.
- ADR-006: Normalizar nombres y corregir `Assigment` a `Assignment`.
