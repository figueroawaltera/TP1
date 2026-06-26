# ADR-002: Usar patrón Strategy para políticas de aceptación de artículos

## Estado

Aceptada.

## Contexto

La selección de artículos aceptados puede variar según la política definida para una sesión. Una sesión puede aceptar artículos según un porcentaje del total, mientras que otra podría aceptar una cantidad fija.

La regla de aceptación no debería quedar rígidamente implementada dentro de `Session` ni dentro de `SelectionStage`, porque eso obligaría a modificar esas clases cada vez que aparezca una nueva política.

Además, la selección no solo calcula una lista: también marca los artículos como aceptados o rechazados, por lo que la política concentra una decisión de negocio relevante.

## Decisión

Se adopta el patrón **Strategy** para encapsular las políticas de aceptación.

Se define una abstracción `AcceptancePolicy`, con operaciones comunes para ordenar artículos y obtener los aceptados.

Las políticas concretas implementan el criterio específico de selección:

- `AcceptanceByPercentage`: acepta hasta un porcentaje configurable del total de artículos.
- `AcceptanceByCount`: acepta hasta una cantidad fija de artículos.

La clase `Session` mantiene una política de aceptación configurable mediante `setAcceptancePolicy(policy)`. La etapa `SelectionStage` delega la selección en la política actual de la sesión.

## Consecuencias

### Positivas

- Permite cambiar el criterio de aceptación sin modificar `Session`.
- Permite agregar nuevas políticas, como aceptación por ranking, por track o por cupo mínimo, sin alterar el flujo general.
- Mejora la separación entre proceso de la conferencia y regla de selección.
- Facilita testear cada política de manera aislada.

### Negativas

- La selección queda distribuida entre `SelectionStage` y la política configurada.
- Es necesario asegurar que todas las políticas respeten reglas comunes del dominio, por ejemplo el uso de `finalScore()` o el puntaje mínimo aceptable si corresponde.

## Refactoring asociado

Actualmente las políticas comparten parte de la lógica de ordenamiento mediante `AcceptancePolicy`. Como mejora futura, se recomienda centralizar también reglas comunes como el score mínimo aceptable, si ese criterio debe aplicar a todas las políticas.

## Decisiones relacionadas

- ADR-003: Centralizar reglas de score y límites de revisión.
