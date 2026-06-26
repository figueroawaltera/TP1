# ADR-003: Centralizar reglas de score y límites de revisión

## Estado

Propuesta.

## Contexto

El modelo de artículos incluye reglas de negocio asociadas a la revisión:

- Un artículo puede recibir como máximo 3 revisiones.
- El score normal se calcula como el promedio de las revisiones recibidas.
- El score final penaliza las revisiones faltantes con puntaje -3.
- Para la selección por porcentaje se considera aceptable un artículo con `finalScore()` mayor o igual a 1.

Actualmente algunas de estas reglas aparecen expresadas como números literales, especialmente el valor `3` usado como cantidad esperada de revisiones. Esto puede generar inconsistencias si el límite cambia en el futuro.

También existe duplicación parcial entre el cálculo de `score()` y `finalScore()`, ya que ambos recorren las revisiones para sumar sus puntajes.

## Decisión

Se propone centralizar las reglas de score y límites de revisión en una única fuente de verdad.

Como primera mejora, se utilizará la constante existente `Paper.allowedReviews` en todos los lugares donde se necesita la cantidad máxima o esperada de revisiones.

Además, se propone extraer métodos auxiliares en `Paper` para evitar duplicación:

```js
reviewScoreSum() {
    return this.reviews().reduce((sum, review) => sum + review.score(), 0);
}

missingReviewsCount() {
    return Math.max(Paper.allowedReviews - this.reviewsCount(), 0);
}
```

Luego `score()` y `finalScore()` deberían usar esos métodos.

## Consecuencias

### Positivas

- Reduce números mágicos dentro del código.
- Evita inconsistencias si cambia la cantidad máxima de revisiones.
- Mejora la legibilidad de `Paper`.
- Facilita modificar la política de penalización por revisiones faltantes.

### Negativas

- Se agregan métodos auxiliares a `Paper`.
- Si las reglas de score crecen demasiado, podría ser necesario extraer una política específica de scoring.

## Alternativas consideradas

### Mantener la lógica actual

Se descartó porque mantiene duplicación y números literales dispersos.

### Crear una clase `ScoringPolicy` inmediatamente

Se considera una alternativa válida, pero puede ser excesiva para el tamaño actual del proyecto. Se recomienda primero centralizar constantes y extraer métodos simples. Si el cálculo de score evoluciona, se podrá extraer una política dedicada.

## Decisiones relacionadas

- ADR-002: Usar patrón Strategy para políticas de aceptación de artículos.
