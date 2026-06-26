# ADR-001: Usar patrón State para modelar las etapas de una sesión

## Estado

Aceptada.

## Contexto

Una sesión de conferencia atraviesa distintas etapas del flujo de trabajo: recepción de artículos, bidding, asignación de revisores, revisión y selección de artículos aceptados.

Cada etapa habilita algunas operaciones y bloquea otras. Por ejemplo, durante la recepción se pueden enviar artículos, pero no se pueden cargar revisiones. Durante la selección se pueden obtener artículos aceptados, pero no se deberían registrar nuevas revisiones.

Si todas estas reglas se resolvieran dentro de `Session` mediante condicionales, la clase crecería demasiado y concentraría responsabilidades que pertenecen a cada fase del proceso.

## Decisión

Se adopta el patrón **State** para representar cada etapa de la sesión mediante una clase específica.

La clase `Session` mantiene una referencia a la etapa actual. Las operaciones dependientes del momento del proceso se delegan al objeto de etapa correspondiente.

Las etapas principales son:

- `ReceivingStage`: permite recibir artículos válidos.
- `BiddingStage`: permite registrar o actualizar bids.
- `AssigmentStage`: permite asignar revisores.
- `RevisionStage`: permite registrar revisiones.
- `SelectionStage`: permite obtener artículos ordenados y aceptados.

La clase base `SessionStage` define el comportamiento por defecto para operaciones no permitidas, generalmente lanzando errores cuando una acción no corresponde a la etapa actual.

## Consecuencias

### Positivas

- Se evita llenar `Session` con condicionales por etapa.
- Cada clase de etapa concentra las reglas propias de ese momento del flujo.
- Es más simple agregar nuevas etapas sin modificar en exceso la clase `Session`.
- Los tests pueden verificar explícitamente qué operaciones están permitidas o prohibidas en cada etapa.

### Negativas

- Aumenta la cantidad de clases del modelo.
- El flujo requiere avanzar correctamente de una etapa a otra.
- Algunas operaciones quedan distribuidas entre `Session` y sus estados, por lo que es importante mantener nombres claros.

## Decisiones relacionadas

- ADR-004: Refactorizar la asignación de revisores.
- ADR-006: Normalizar nombres y corregir `Assigment` a `Assignment`.
