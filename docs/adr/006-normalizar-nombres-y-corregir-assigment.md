# ADR-006: Normalizar nombres y corregir `Assigment` a `Assignment`

## Estado

Propuesta.

## Contexto

El modelo contiene una clase llamada `Assigment`, junto con métodos relacionados como:

- `assigmentFor`
- `assigmentExistsFor`
- `assigmentsPapers`
- `enterAssigment`

El término correcto en inglés es `Assignment`. El error tipográfico aparece en nombres de archivos, clases y métodos, por lo que se propaga al diseño, al código y a los tests.

Además, el proyecto mezcla nombres en inglés y español. Algunas clases y métodos están en inglés, como `Session`, `Paper`, `Review`, `addReviewer` y `score`; mientras que otros están en español, como `calcularCargaDeRevisiones`, `cantidadArticulosAAceptar`, `obtenerArticulosAceptados` y `esAutor`.

La mezcla de idiomas no rompe el funcionamiento, pero reduce la consistencia del modelo y puede dificultar la lectura del código.

## Decisión

Se propone corregir el typo `Assigment` a `Assignment` en clase, archivo y métodos asociados.

Cambios sugeridos:

```txt
src/Assigment.js       -> src/Assignment.js
Assigment              -> Assignment
assigmentFor           -> assignmentFor
assigmentExistsFor     -> assignmentExistsFor
assigmentsPapers       -> assignmentsForPaperCount
enterAssigment         -> enterAssignment
```

También se propone avanzar gradualmente hacia una convención única de idioma para los nombres del dominio. Dado que las clases principales ya están en inglés, se recomienda normalizar los nuevos nombres en inglés.

Ejemplos sugeridos:

```txt
calcularCargaDeRevisiones  -> calculateReviewLoad
cantidadArticulosAAceptar  -> acceptedPaperLimit
obtenerArticulosAceptados  -> acceptedPapers
obtenerArticulosOrdenadosPorScore -> papersSortedByScore
esAutor -> hasAuthor
```

## Consecuencias

### Positivas

- Mejora la legibilidad del código.
- Evita que el error tipográfico se siga propagando.
- Mejora la calidad del diseño documentado en UML y ADRs.
- Facilita la comunicación técnica usando nombres consistentes.

### Negativas

- Requiere actualizar imports, tests y referencias existentes.
- Puede generar cambios amplios aunque conceptualmente simples.
- Si el cambio se hace de una sola vez, puede dificultar la revisión del diff.

## Estrategia de implementación recomendada

Se recomienda hacer el cambio en dos pasos:

1. Corregir `Assigment` a `Assignment` y ejecutar todos los tests.
2. Normalizar nombres en español a inglés de manera incremental, priorizando los métodos públicos más usados.

## Decisiones relacionadas

- ADR-001: Usar patrón State para modelar las etapas de una sesión.
- ADR-004: Refactorizar la asignación de revisores.
